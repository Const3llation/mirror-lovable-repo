import { messageService } from "@/features/messaging/services/message-service";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { formatDate } from "@/utils/date";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const completeRegistrationSchema = z.object({
	providerId: z.number(),
});

export async function PUT(request: NextRequest) {
	try {
		const body = await request.json();
		const { providerId } = completeRegistrationSchema.parse(body);

		const updatedProvider = await payload.update({
			collection: "service-providers",
			id: providerId,
			data: {
				registrationProcessStatus: "Completed",
			},
		});

		// Send welcome email to provider
		try {
			await messageService.send({
				template: "REGISTRATION_WELCOME",
				recipient: {
					email: updatedProvider.email,
					name: updatedProvider.providerName,
				},
				data: {
					name: updatedProvider.providerName,
				},
			});

			logger.info("Registration welcome email sent to provider", {
				providerName: updatedProvider.providerName,
			});
		} catch (error) {
			logger.error("Failed to send welcome email to provider", {
				error,
				providerName: updatedProvider.providerName,
				email: updatedProvider.email,
			});
		}

		// Send notification to admin
		try {
			await messageService.send({
				template: "PROVIDER_REGISTRATION",
				recipient: {
					email: process.env.ADMIN_EMAIL as string,
					name: "Admin",
				},
				data: {
					provider_name: updatedProvider.providerName,
					provider_email: updatedProvider.email,
					registration_date: formatDate(new Date()),
					cms_profile_url: `${process.env.NEXT_PUBLIC_CMS_URL}/admin/collections/service-providers/${updatedProvider.id}`,
				},
			});

			logger.info("Registration notification email sent to admin", {
				providerName: updatedProvider.providerName,
			});
		} catch (error) {
			logger.error("Failed to send registration notification to admin", {
				error,
				providerName: updatedProvider.providerName,
			});
		}

		return NextResponse.json({
			success: true,
			provider: updatedProvider,
		});
	} catch (error) {
		console.error("Failed to complete registration:", error);

		if (error instanceof z.ZodError) {
			return NextResponse.json(
				{ error: "Invalid request data", details: error.errors },
				{ status: 400 },
			);
		}

		return NextResponse.json(
			{ error: "Failed to complete registration" },
			{ status: 500 },
		);
	}
}
