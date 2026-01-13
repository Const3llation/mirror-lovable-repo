import { messageService } from "@/features/messaging/services/message-service";
import { serviceProvidersContactFormSchema } from "@/features/service-providers/schemas/contact";
import { transformContactFormToCMS } from "@/features/service-providers/utils/transformers";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { formatDate } from "@/utils/date";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const contactApiSchema = serviceProvidersContactFormSchema.extend({
	serviceProviderSlug: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		const validationResult = contactApiSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Invalid request data",
					details: validationResult.error.errors,
				},
				{ status: 400 },
			);
		}

		// Find the service provider first
		const provider = await payload.find({
			collection: "service-providers",
			where: {
				slug: {
					equals: validationResult.data.serviceProviderSlug,
				},
			},
		});

		if (!provider.docs.length) {
			return NextResponse.json(
				{ error: "Service provider not found" },
				{ status: 404 },
			);
		}

		const transformedData = transformContactFormToCMS(validationResult.data);

		const contact = await payload.create({
			collection: "provider-contacts",
			data: {
				...transformedData,
				serviceProvider: provider.docs[0].id,
			},
		});

		// NOTE:
		// We are sending the email to VERIFIED service provider from a collection hook
		// this is because uploaded files are not available at this point in time and
		// we need to forward them to the provider

		// If provider is not verified, notify admin
		if (provider.docs[0].visibility?.status === "Unverified") {
			try {
				await messageService.send({
					template: "UNVERIFIED_CONTACT_REQUEST",
					recipient: {
						email: process.env.ADMIN_EMAIL as string,
						name: "Admin",
					},
					data: {
						provider_name: provider.docs[0].providerName,
						client_name: `${validationResult.data.basicInformation.firstName} ${validationResult.data.basicInformation.lastName}`,
						client_email: validationResult.data.basicInformation.email,
						request_date: formatDate(new Date()),
						cms_request_url: `${process.env.NEXT_PUBLIC_CMS_URL}/admin/collections/provider-contacts/${contact.id}`,
					},
				});
			} catch (error) {
				logger.error({
					msg: "Failed to send unverified contact request notification to admin",
					err: error instanceof Error ? error : new Error(String(error)),
					metadata: {
						providerId: provider.docs[0].id,
					},
				});
			}
		}

		// Send confirmation email to client
		try {
			await messageService.send({
				template: "CONTACT_RECEIVED",
				recipient: {
					email: validationResult.data.basicInformation.email,
					name: `${validationResult.data.basicInformation.firstName} ${validationResult.data.basicInformation.lastName}`,
				},
				data: {
					provider_name: provider.docs[0].providerName,
				},
			});
		} catch (error) {
			logger.error({
				msg: "Failed to send confirmation email to client",
				err: error instanceof Error ? error : new Error(String(error)),
				metadata: {
					contactId: contact.id,
				},
			});
		}

		return NextResponse.json({
			success: true,
			id: contact.id,
		});
	} catch (error) {
		logger.error({
			msg: "Failed to create contact",
			err: error instanceof Error ? error : new Error(String(error)),
		});
		return NextResponse.json(
			{ error: "Failed to create contact" },
			{ status: 500 },
		);
	}
}
