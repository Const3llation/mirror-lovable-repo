import { r2Client } from "@/lib/r2";
import {
	AbortMultipartUploadCommand,
	ListMultipartUploadsCommand,
} from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export async function POST(request: NextRequest) {
	try {
		// List all ongoing multipart uploads
		const listCommand = new ListMultipartUploadsCommand({
			Bucket: BUCKET_NAME,
		});

		const { Uploads } = await r2Client.send(listCommand);

		if (!Uploads || Uploads.length === 0) {
			return NextResponse.json({ message: "No ongoing uploads found" });
		}

		// Abort each ongoing upload
		const abortPromises = Uploads.map(async (upload) => {
			if (!upload.Key || !upload.UploadId) {
				console.warn("Missing Key or UploadId for upload:", upload);
				return;
			}

			const abortCommand = new AbortMultipartUploadCommand({
				Bucket: BUCKET_NAME,
				Key: upload.Key,
				UploadId: upload.UploadId,
			});

			try {
				await r2Client.send(abortCommand);
				return { key: upload.Key, status: "aborted" };
			} catch (error) {
				console.error(`Failed to abort upload ${upload.Key}:`, error);
				return { key: upload.Key, status: "failed" };
			}
		});

		const results = await Promise.all(abortPromises);

		return NextResponse.json({
			message: `Cleaned up ${Uploads.length} ongoing uploads`,
			results: results.filter(Boolean), // Remove any undefined results
		});
	} catch (error) {
		console.error("Error cleaning up multipart uploads:", error);
		return NextResponse.json(
			{ error: "Failed to clean up uploads" },
			{ status: 500 },
		);
	}
}
