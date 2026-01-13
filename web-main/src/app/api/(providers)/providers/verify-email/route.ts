import { randomInt } from "node:crypto";
import { messageService } from "@/features/messaging/services/message-service";
import payload from "@/lib/payload";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// -------------------------
// Configuration & Schemas
// -------------------------

const MAX_ATTEMPTS = 3;

const EmailSchema = z.object({
	email: z.string().email(),
});

// -------------------------
// Helper Functions
// -------------------------

function generateVerificationCode(): string {
	return randomInt(0, 100000).toString().padStart(5, "0");
}

// -------------------------
// POST /api/providers/verify-email
// -------------------------

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

		if (existingVerification.docs.length > 0) {
			return NextResponse.json(
				{
					error:
						"Verification code was already sent. Please check your email or resend the verification code.",
				},
				{ status: 429 },
			);
		}

		const verificationCode = generateVerificationCode();

		await messageService.send({
			template: "EMAIL_VERIFICATION",
			recipient: {
				email,
			},
			data: {
				code: verificationCode,
				expires_in: "15 minutes", // TODO: Make this configurable
			},
		});

		await payload.create({
			collection: "verify-providers-email",
			data: {
				email,
				verificationCode,
				status: "Pending",
				attempts: 0,
				maxAttempts: MAX_ATTEMPTS,
			},
		});

		return NextResponse.json(
			{ message: "Verification code sent successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error sending verification code:", error);
		return NextResponse.json(
			{ error: "Failed to send verification code" },
			{ status: 500 },
		);
	}
}
