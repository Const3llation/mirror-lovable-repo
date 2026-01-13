import { generateSecureFilename } from "@/features/file-uploads/services/file-security";
import {
	validateFileExtension,
	validateFileUpload,
} from "@/features/file-uploads/services/file-validation";
import { uploadToPayloadCMS } from "@/features/file-uploads/services/payload-upload";
import type { UploadResponse } from "@/features/file-uploads/types";

export class FileProcessingError extends Error {
	constructor(
		message: string,
		public status = 400,
		public originalError?: unknown,
	) {
		super(message);
		this.name = "FileProcessingError";
	}
}

export async function processFileUpload(
	file: File,
	fieldPath: string,
	serviceProviderId: string,
	abortSignal: AbortSignal,
): Promise<UploadResponse> {
	if (!isValidFieldPath(fieldPath)) {
		throw new FileProcessingError("Invalid field path", 400);
	}

	if (!validateFileExtension(file.name)) {
		throw new FileProcessingError("Invalid file extension", 400);
	}

	const validationError = await validateFileUpload(file);
	if (validationError) {
		throw new FileProcessingError(validationError, 400);
	}

	const prefix = fieldPath.split(".").pop() || "file";
	const secureFilename = generateSecureFilename(file.name, {
		prefix,
		timestamp: true,
		providerId: serviceProviderId,
	});

	const secureFile = new File([file], secureFilename, { type: file.type });

	try {
		return await uploadToPayloadCMS(
			secureFile,
			serviceProviderId,
			fieldPath,
			abortSignal,
		);
	} catch (error) {
		if (error instanceof Error) {
			if (error.name === "AbortError") {
				throw new FileProcessingError("Upload timeout - please try again", 408);
			}

			if (
				error.message.includes("ETIMEDOUT") ||
				error.message.includes("ENETUNREACH") ||
				error.message.includes("Network connection failed")
			) {
				throw new FileProcessingError(
					"Network connection failed - please check your connection",
					503,
				);
			}
		}

		throw error; // Re-throw PayloadUploadError or other unexpected errors
	}
}

export function isValidFieldPath(fieldPath: string): boolean {
	const validPathPatterns = [
		"branding.logo",
		"team.teamMembers.*.image",
		"portfolio.caseStudies.*.files.*",
		"portfolio.caseStudies.*.images.*",
		"project.files.*",
	];

	// Replace all numeric indices with * (e.g., "portfolio.caseStudies.0.files.0" -> "portfolio.caseStudies.*.files.*")
	const normalizedPath = fieldPath.replace(/\.\d+\./g, ".*.");

	// Handle trailing numeric index (e.g., "portfolio.caseStudies.0.files.0" -> "portfolio.caseStudies.*.files.*")
	const fullyNormalizedPath = normalizedPath.replace(/\.\d+$/, ".*");

	return validPathPatterns.some((pattern) => fullyNormalizedPath === pattern);
}
