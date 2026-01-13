import { r2Client } from "@/lib/r2";
import {
	AbortMultipartUploadCommand,
	CompleteMultipartUploadCommand,
} from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

const CompleteUploadSchema = z.object({
	fileKey: z.string(),
	uploadId: z.string(),
	parts: z.array(
		z.object({
			partNumber: z.number(),
			eTag: z.string(),
		}),
	),
});

export async function POST(request: NextRequest) {
	let body: z.infer<typeof CompleteUploadSchema> | undefined;

	try {
		body = await request.json();
		const result = CompleteUploadSchema.safeParse(body);

		if (!result.success) {
			return NextResponse.json(
				{ error: "Invalid request data" },
				{ status: 400 },
			);
		}

		const { fileKey, uploadId, parts } = result.data;

		await r2Client.send(
			new CompleteMultipartUploadCommand({
				Bucket: BUCKET_NAME,
				Key: fileKey,
				UploadId: uploadId,
				MultipartUpload: {
					Parts: parts.map(({ partNumber, eTag }) => ({
						PartNumber: partNumber,
						ETag: eTag,
					})),
				},
			}),
		);

		return NextResponse.json({ success: true, fileKey });
	} catch (error) {
		console.error("Error completing multipart upload:", error);

		// Only attempt abort if we have valid body data
		if (body?.fileKey && body?.uploadId) {
			try {
				await r2Client.send(
					new AbortMultipartUploadCommand({
						Bucket: BUCKET_NAME,
						Key: body.fileKey,
						UploadId: body.uploadId,
					}),
				);
			} catch (abortError) {
				console.error("Error aborting multipart upload:", abortError);
			}
		}

		return NextResponse.json(
			{ error: "Failed to complete upload" },
			{ status: 500 },
		);
	}
}
