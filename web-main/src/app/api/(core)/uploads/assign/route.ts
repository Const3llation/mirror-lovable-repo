import path from "node:path";
import { isValidFieldPath } from "@/features/file-uploads/services/file-processor";
import {
	isImageUpload,
	validateFileExtension,
} from "@/features/file-uploads/services/file-validation";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import type { RemoteFileUpload, ServiceProvider } from "@/types/payload";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const AssignUploadSchema = z.object({
	fileKey: z.string(),
	fieldPath: z.string(),
	context: z.object({
		type: z.enum(["service-provider", "provider-review", "provider-contact"]),
		id: z.union([z.string(), z.number()]),
	}),
});

const MIME_TYPES = {
	".pdf": "application/pdf",
	".doc": "application/msword",
	".docx":
		"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	".xls": "application/vnd.ms-excel",
	".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	".ppt": "application/vnd.ms-powerpoint",
	".pptx":
		"application/vnd.openxmlformats-officedocument.presentationml.presentation",
	".txt": "text/plain",
	".md": "text/markdown",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".png": "image/png",
	".webp": "image/webp",
} as const;

type FieldMapping = {
	path: string;
	collection: string;
	handler: ({
		data,
		uploadId,
		fieldPath,
	}: {
		data: ServiceProvider;
		uploadId: number;
		fieldPath: string;
	}) => Partial<ServiceProvider>;
};

const FIELD_MAPPINGS: FieldMapping[] = [
	{
		path: "branding.logo",
		collection: "logo",
		handler: ({ uploadId }) => ({
			logo: {
				relationTo: "remote-file-uploads",
				value: uploadId,
			},
		}),
	},
	{
		path: "teamMembers",
		collection: "teamMembers",
		handler: ({ data, uploadId }) => ({
			teamMembers: (data.teamMembers || []).map((member) => ({
				...member,
				image: {
					relationTo: "remote-file-uploads",
					value: uploadId,
				},
			})),
		}),
	},
	{
		path: "caseStudies",
		collection: "caseStudies",
		handler: ({ data, uploadId, fieldPath }) => ({
			caseStudies: (data.caseStudies || []).map((study) => ({
				...study,
				files: study.files || [],
				images: study.images || [],
				...(fieldPath.includes("files")
					? {
							files: [
								...(study.files || []),
								{ relationTo: "remote-file-uploads", value: uploadId },
							],
						}
					: {}),
				...(fieldPath.includes("images")
					? {
							images: [
								...(study.images || []),
								{ relationTo: "remote-file-uploads", value: uploadId },
							],
						}
					: {}),
			})),
		}),
	},
];

const getFieldMapping = (fieldPath: string): FieldMapping | undefined =>
	FIELD_MAPPINGS.find(
		(mapping) =>
			fieldPath === mapping.path || fieldPath.includes(mapping.collection),
	);

type AssignmentContext = {
	type: "service-provider" | "provider-review" | "provider-contact";
	id: string | number;
};

type AssignmentHandler = {
	collection: string;
	updateData: (params: {
		data: unknown;
		uploadId: number;
		fieldPath: string;
		context: AssignmentContext;
	}) => Promise<unknown>;
};

const ASSIGNMENT_HANDLERS: Record<string, AssignmentHandler> = {
	"service-provider": {
		collection: "service-providers",
		updateData: async ({ data, uploadId, fieldPath }) => {
			const mapping = getFieldMapping(fieldPath);
			if (!mapping) {
				throw new Error(`No mapping found for field path: ${fieldPath}`);
			}

			return mapping.handler({
				data,
				uploadId: Number(uploadId),
				fieldPath,
			});
		},
	},
	"provider-review": {
		collection: "provider-reviews",
		updateData: async ({ data, uploadId, fieldPath }) => {
			return {
				project: {
					...data.project,
					file: {
						relationTo: "remote-file-uploads",
						value: uploadId,
					},
				},
			};
		},
	},
	"provider-contact": {
		collection: "provider-contacts",
		updateData: async ({ data, uploadId }) => {
			return {
				project: {
					...data.project,
					file: {
						relationTo: "remote-file-uploads",
						value: uploadId,
					},
				},
			};
		},
	},
};

const updateCollectionData = async (
	uploadRecord: RemoteFileUpload,
	fieldPath: string,
	context: AssignmentContext,
): Promise<unknown> => {
	if (!isValidFieldPath(fieldPath)) {
		throw new Error(`Invalid field path: ${fieldPath}`);
	}

	const handler = ASSIGNMENT_HANDLERS[context.type];
	if (!handler) {
		throw new Error(`No handler found for context type: ${context.type}`);
	}

	const existingData = await payload.findByID({
		collection: handler.collection,
		depth: 0,
		id: context.id,
	});

	const updatedData = await handler.updateData({
		data: existingData,
		uploadId: Number(uploadRecord.id),
		fieldPath,
		context,
	});

	return await payload.update({
		collection: handler.collection,
		id: context.id,
		data: {
			...existingData,
			...updatedData,
		},
	});
};

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();
		const result = AssignUploadSchema.safeParse(body);

		if (!result.success) {
			logger.warn("Invalid request data for upload assignment", {
				errors: result.error.errors,
			});
			return NextResponse.json(
				{ error: "Invalid request data" },
				{ status: 400 },
			);
		}

		const { fileKey, fieldPath, context } = result.data;

		if (!validateFileExtension(fileKey)) {
			logger.warn("Invalid file extension for upload", { fileKey });
			return NextResponse.json(
				{ error: "Invalid file extension" },
				{ status: 400 },
			);
		}

		const fileExtension = path.extname(fileKey).toLowerCase();
		const mimeType =
			MIME_TYPES[fileExtension as keyof typeof MIME_TYPES] ||
			"application/octet-stream";
		const fileType = isImageUpload(mimeType) ? "image" : "document";

		const uploadRecord = await payload.create({
			collection: "remote-file-uploads",
			data: {
				type: fileType,
				remoteURL: fileKey,
				serviceProvider:
					context.type === "service-provider" ? Number(context.id) : undefined,
				providerReview:
					context.type === "provider-review" ? Number(context.id) : undefined,
				providerContact:
					context.type === "provider-contact" ? Number(context.id) : undefined,
			},
		});

		await updateCollectionData(uploadRecord, fieldPath, context);

		return NextResponse.json({
			success: true,
			upload: {
				id: uploadRecord.id,
				type: uploadRecord.type,
				url: uploadRecord.remoteURL,
			},
		});
	} catch (error) {
		logger.error({
			msg: "Error assigning upload",
			err: error instanceof Error ? error : new Error(String(error)),
		});
		return NextResponse.json(
			{ error: "Failed to assign upload" },
			{ status: 500 },
		);
	}
}
