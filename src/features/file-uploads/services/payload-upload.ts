import { isImageUpload } from "@/features/file-uploads/services/file-validation";
import type { UploadResponse } from "@/features/file-uploads/types";
import payload from "@/lib/payload";

const PAYLOAD_CMS_URL = process.env.NEXT_PUBLIC_CMS_URL;
const IMAGE_UPLOAD_ENDPOINT = `${PAYLOAD_CMS_URL}/api/image-uploads`;
const FILE_UPLOAD_ENDPOINT = `${PAYLOAD_CMS_URL}/api/file-uploads`;

export class PayloadUploadError extends Error {
	constructor(
		message: string,
		public status: number,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "PayloadUploadError";
	}
}

export async function uploadToPayloadCMS(
	file: File,
	serviceProviderId: string,
	fieldPath: string,
	abortSignal: AbortSignal,
): Promise<UploadResponse> {
	try {
		if (!file || file.size === 0) {
			throw new PayloadUploadError("Invalid file: File is empty", 400);
		}

		const collection = isImageUpload(file.type)
			? "image-uploads"
			: "file-uploads";

		const formData = new FormData();
		formData.append("file", file);
		formData.append(
			"_payload",
			JSON.stringify({
				serviceProvider: Number(serviceProviderId),
			}),
		);

		const uploadEndpoint = isImageUpload(file.type)
			? IMAGE_UPLOAD_ENDPOINT
			: FILE_UPLOAD_ENDPOINT;

		const response = await fetch(uploadEndpoint, {
			method: "POST",
			body: formData,
			credentials: "include",
			signal: abortSignal,
		});

		if (!response.ok) {
			const errorData = await response.json().catch(() => ({}));
			console.error("Upload response error:", {
				status: response.status,
				statusText: response.statusText,
				errorData,
			});

			const errorMessage =
				errorData.errors?.[0]?.message ||
				errorData.message ||
				errorData.error ||
				"Upload failed - please try again";

			throw new PayloadUploadError(errorMessage, response.status, errorData);
		}

		const uploadData = await response.json();

		// Update the service provider with the uploaded file reference
		await updateServiceProviderField(
			serviceProviderId,
			fieldPath,
			uploadData.doc.id,
		);

		return {
			url: uploadData.doc.url,
			filename: uploadData.doc.filename,
			mimeType: uploadData.doc.mimeType,
			filesize: uploadData.doc.filesize,
			width: isImageUpload(file.type) ? uploadData.doc.width : undefined,
			height: isImageUpload(file.type) ? uploadData.doc.height : undefined,
			fieldPath,
			id: uploadData.doc.id,
			serviceProvider: serviceProviderId,
		};
	} catch (error) {
		console.error("Upload error:", {
			message: error.message,
			status: error.status,
			fileInfo: {
				name: file.name,
				size: file.size,
				type: file.type,
			},
		});

		if (error instanceof PayloadUploadError) {
			throw error;
		}

		throw new PayloadUploadError(
			error.message || "Upload failed - please try again",
			error.status || 500,
			error,
		);
	}
}

async function updateServiceProviderField(
	serviceProviderId: string,
	fieldPath: string,
	uploadId: string,
): Promise<void> {
	try {
		const fieldPathParts = fieldPath.split(".");
		let updateData: Record<string, unknown> = {};

		if (fieldPathParts[0] === "caseStudies") {
			// Handle case studies array updates
			const serviceProvider = await payload.findByID({
				collection: "service-providers",
				id: serviceProviderId,
			});

			const caseStudies = serviceProvider.caseStudies || [];
			const caseStudyIndex = Number.parseInt(fieldPathParts[1]); // Get the index from the path
			const fieldName = fieldPathParts[2]; // 'files' or 'images'

			// Create a new array with the updated case study
			const updatedCaseStudies = [...caseStudies];
			if (!updatedCaseStudies[caseStudyIndex]) {
				updatedCaseStudies[caseStudyIndex] = {};
			}

			const existingFiles = updatedCaseStudies[caseStudyIndex][fieldName] || [];
			updatedCaseStudies[caseStudyIndex] = {
				...updatedCaseStudies[caseStudyIndex],
				[fieldName]: [...existingFiles, uploadId],
			};

			updateData = { caseStudies: updatedCaseStudies };
		} else if (
			fieldPathParts[0] === "team" &&
			fieldPathParts[1] === "teamMembers"
		) {
			// Handle team members array updates
			const serviceProvider = await payload.findByID({
				collection: "service-providers",
				id: serviceProviderId,
			});

			const teamMembers = serviceProvider.teamMembers || [];
			const memberIndex = Number.parseInt(fieldPathParts[2]);

			const updatedTeamMembers = [...teamMembers];
			if (!updatedTeamMembers[memberIndex]) {
				updatedTeamMembers[memberIndex] = {};
			}

			updatedTeamMembers[memberIndex] = {
				...updatedTeamMembers[memberIndex],
				image: uploadId,
			};

			updateData = { teamMembers: updatedTeamMembers };
		} else if (
			fieldPathParts[0] === "branding" &&
			fieldPathParts[1] === "logo"
		) {
			// Handle logo field update
			updateData = { logo: uploadId };
		} else {
			// For any other direct fields
			updateData = { [fieldPath]: uploadId };
		}

		await payload.update({
			collection: "service-providers",
			id: serviceProviderId,
			data: updateData,
		});
	} catch (error) {
		console.error("Failed to update service provider:", error);
		throw new PayloadUploadError(
			"Failed to update service provider with upload reference",
			error.status || 500,
			error,
		);
	}
}
