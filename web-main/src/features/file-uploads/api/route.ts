import crypto from "node:crypto";
import { UploadRequestSchema } from "@/features/file-uploads/api/validation";
import { UPLOAD_TIMEOUT } from "@/features/file-uploads/config/constants";
import {
	FileProcessingError,
	isValidFieldPath,
} from "@/features/file-uploads/services/file-processor";
import { validateFileExtension } from "@/features/file-uploads/services/file-validation";
import { PayloadUploadError } from "@/features/file-uploads/services/payload-upload";
import { r2Client } from "@/lib/r2";
import uploadFilesLimiter from "@/lib/rate-limiter/limiters/upload-files-limiter";
import {
	CreateMultipartUploadCommand,
	UploadPartCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { type NextRequest, NextResponse } from "next/server";

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks
const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export async function POST(request: NextRequest) {
	try {
		// Check rate limit first
		const isLimited = await uploadFilesLimiter.isRateLimited(request);
		if (isLimited) {
			return NextResponse.json(
				{ error: "Too many upload requests. Please try again later." },
				{ status: 429 },
			);
		}

		const body = await request.json();

		// Validate request body
		const result = UploadRequestSchema.safeParse(body);
		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data", details: result.error.flatten() },
				{ status: 400 },
			);
		}

		const { filename, contentType, size, fieldPath } = result.data;

		// Validate field path
		if (!isValidFieldPath(fieldPath)) {
			return NextResponse.json(
				{ error: "Invalid field path" },
				{ status: 400 },
			);
		}

		// Validate file extension
		if (!validateFileExtension(filename)) {
			return NextResponse.json(
				{ error: "Invalid file extension" },
				{ status: 400 },
			);
		}

		// Generate a unique key for the file
		const fileKey = `${crypto.randomUUID()}-${filename}`;
		const chunks = Math.ceil(size / CHUNK_SIZE);

		// Initialize multipart upload
		const createMultipartCommand = new CreateMultipartUploadCommand({
			Bucket: BUCKET_NAME,
			Key: fileKey,
			ContentType: contentType,
			Metadata: {
				fieldPath,
			},
		});

		const multipartUpload = await r2Client.send(createMultipartCommand);
		const uploadId = multipartUpload.UploadId;

		if (!uploadId) {
			throw new Error("Failed to initialize multipart upload");
		}

		// Generate presigned URLs for each part
		const urls = await Promise.all(
			Array.from({ length: chunks }, async (_, index) => {
				const partNumber = index + 1; // Part numbers must start at 1
				const command = {
					Bucket: BUCKET_NAME,
					Key: fileKey,
					UploadId: uploadId,
					PartNumber: partNumber,
				};

				const presignedUrl = await getSignedUrl(
					r2Client,
					new UploadPartCommand(command),
					{
						expiresIn: 3600, // URL expires in 1 hour
					},
				);

				return {
					url: presignedUrl,
					partNumber,
				};
			}),
		);

		return NextResponse.json({
			urls,
			fileKey,
			uploadId,
			expiresAt: new Date(Date.now() + 3600 * 1000),
		});
	} catch (error) {
		console.error("Error handling upload request:", error);

		if (error instanceof FileProcessingError) {
			return NextResponse.json(
				{ error: error.message },
				{ status: error.status },
			);
		}

		if (error instanceof PayloadUploadError) {
			return NextResponse.json(
				{ error: "Upload to storage failed", details: error.message },
				{ status: 500 },
			);
		}

		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 },
		);
	}
}

export const config = {
	api: {
		bodyParser: false,
		maxDuration: UPLOAD_TIMEOUT,
	},
};
