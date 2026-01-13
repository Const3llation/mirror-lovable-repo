import { randomInt } from "node:crypto";
import { messageService } from "@/features/messaging/services/message-service";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const EmailSchema = z.object({
	email: z.string().email(),
});

// TODO: Move to a shared utility function
function generateVerificationCode(): string {
	return randomInt(0, 100000).toString().padStart(5, "0");
}

export async function POST(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const parsed = EmailSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request payload", details: parsed.error.format() },
				{ status: 400 },
			);
		}
		const { email } = parsed.data;

		const existingVerification = await payload.find({
			collection: "verify-providers-email",
			where: {
				email: { equals: email },
				status: { equals: "Pending" },
			},
		});

		if (existingVerification.docs.length === 0) {
			return NextResponse.json(
				{ error: "No pending verification found" },
				{ status: 404 },
			);
		}

		const verification = existingVerification.docs[0];

		const verificationCode = generateVerificationCode();

		try {
			await messageService.send({
				template: "EMAIL_VERIFICATION",
				recipient: { email },
				data: { code: verificationCode, expires_in: "15 minutes" },
			});

			await payload.update({
				collection: "verify-providers-email",
				id: verification.id,
				data: {
					verificationCode,
					attempts: 0,
				},
			});

			logger.info("Verification email sent successfully", {
				email,
			});
		} catch (emailError) {
			logger.error("Failed to send verification email", {
				error: emailError,
				email,
			});
		}

		return NextResponse.json(
			{ message: "New verification code sent successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error resending verification code:", error);
		return NextResponse.json(
			{ error: "Failed to resend verification code" },
			{ status: 500 },
		);
	}
}
