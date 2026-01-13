import payload from "@/lib/payload";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const MAX_ATTEMPTS = 3;

const VerificationSchema = z.object({
	email: z.string().email(),
	code: z.string().min(1),
});

export async function PUT(request: NextRequest): Promise<NextResponse> {
	try {
		const body = await request.json();
		const parsed = VerificationSchema.safeParse(body);
		if (!parsed.success) {
			return NextResponse.json(
				{ error: "Invalid request payload", details: parsed.error.format() },
				{ status: 400 },
			);
		}
		const { email, code } = parsed.data;

		const verificationResult = await payload.find({
			collection: "verify-providers-email",
			where: {
				email: { equals: email },
				status: { equals: "Pending" },
			},
		});

		if (verificationResult.docs.length === 0) {
			return NextResponse.json(
				{ error: "No pending verification found" },
				{ status: 404 },
			);
		}

		const verification = verificationResult.docs[0];

		// Check expiration
		if (
			verification.expiresAt &&
			new Date() > new Date(verification.expiresAt)
		) {
			await payload.update({
				collection: "verify-providers-email",
				id: verification.id,
				data: { status: "Expired" },
			});
			return NextResponse.json(
				{ error: "Verification code has expired" },
				{ status: 400 },
			);
		}

		// Check max attempts reached
		if (
			(verification.attempts ?? 0) >= (verification.maxAttempts ?? MAX_ATTEMPTS)
		) {
			await payload.update({
				collection: "verify-providers-email",
				id: verification.id,
				data: { status: "MaxAttemptsReached" },
			});
			return NextResponse.json(
				{ error: "Maximum verification attempts reached" },
				{ status: 400 },
			);
		}

		// Validate code
		if (verification.verificationCode !== code) {
			await payload.update({
				collection: "verify-providers-email",
				id: verification.id,
				data: { attempts: (verification.attempts ?? 0) + 1 },
			});
			return NextResponse.json(
				{ error: "Invalid verification code" },
				{ status: 400 },
			);
		}

		// Mark as verified
		await payload.update({
			collection: "verify-providers-email",
			id: verification.id,
			data: { status: "Verified" },
		});

		return NextResponse.json(
			{ message: "Email verified successfully" },
			{ status: 200 },
		);
	} catch (error) {
		console.error("Error verifying code:", error);
		return NextResponse.json(
			{ error: "Failed to verify code. Try again." },
			{ status: 500 },
		);
	}
}
