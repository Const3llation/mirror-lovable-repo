import { r2Client } from "@/lib/r2";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { type NextRequest, NextResponse } from "next/server";

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

export async function POST(request: NextRequest) {
	try {
		const { key } = await request.json();

		if (!key) {
			return NextResponse.json(
				{ error: "File key is required" },
				{ status: 400 },
			);
		}

		const deleteCommand = new DeleteObjectCommand({
			Bucket: BUCKET_NAME,
			Key: key,
		});

		await r2Client.send(deleteCommand);

		return NextResponse.json({
			message: "File deleted successfully",
			key,
		});
	} catch (error) {
		console.error("Error deleting file:", error);
		return NextResponse.json(
			{ error: "Failed to delete file" },
			{ status: 500 },
		);
	}
}
