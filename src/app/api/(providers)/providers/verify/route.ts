import { messageService } from "@/features/messaging/services/message-service";
import { verifyProviderSchema } from "@/features/service-providers/schemas/verify";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { formatDate } from "@/utils/date";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function POST(req: NextRequest) {
	try {
		const rawData = await req.json();

		const validatedData = verifyProviderSchema
			.extend({
				slug: z.string(),
			})
			.parse(rawData);

		const providerResponse = await payload.find({
			collection: "service-providers",
			where: {
				slug: { equals: validatedData.slug },
			},
		});

		const verifyResponse = await payload.create({
			collection: "verify-providers",
			data: {
				...validatedData,
				serviceProvider: providerResponse.docs[0]?.id,
			},
		});

		try {
			await messageService.send({
				template: "PROVIDER_VERIFY_REQUEST",
				recipient: {
					email: process.env.ADMIN_EMAIL as string,
					name: "Admin",
				},
				data: {
					first_name: validatedData.firstName,
					last_name: validatedData.lastName,
					work_email: validatedData.workEmail,
					position: validatedData.jobPosition,
					request_date: formatDate(new Date()),
					cms_verification_url: `${process.env.NEXT_PUBLIC_CMS_URL}/admin/collections/verify-providers/${verifyResponse.id}`,
					provider_name: providerResponse.docs[0]?.providerName,
				},
			});

			logger.info("Provider verification request email sent to admin", {
				providerId: verifyResponse.id,
			});
		} catch (emailError) {
			logger.error("Failed to send provider verification email to admin", {
				error: emailError,
				providerId: verifyResponse.id,
			});
		}

		return NextResponse.json(verifyResponse);
	} catch (error) {
		if (error instanceof z.ZodError) {
			return NextResponse.json({ error: error.errors }, { status: 400 });
		}

		logger.error("Failed to create verify provider:", { error });
		return NextResponse.json(
			{ error: "Failed to create verify provider" },
			{ status: 500 },
		);
	}
}
