import { r2Client } from "@/lib/r2";
import { AbortMultipartUploadCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export async function POST(request: NextRequest) {
	try {
		const { fileKey, uploadId } = await request.json();

		const abortCommand = new AbortMultipartUploadCommand({
			Bucket: BUCKET_NAME,
			Key: fileKey,
			UploadId: uploadId,
		});

		await r2Client.send(abortCommand);
		return NextResponse.json({ success: true });
	} catch (error) {
		console.error("Error aborting multipart upload:", error);
		return NextResponse.json(
			{ error: "Failed to abort upload" },
			{ status: 500 },
		);
	}
}
