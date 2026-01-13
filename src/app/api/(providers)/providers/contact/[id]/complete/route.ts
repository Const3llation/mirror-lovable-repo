import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import { messageService } from "@/features/messaging/services/message-service";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(
	req: NextRequest,
	{ params }: { params: Promise<{ id: string }> },
) {
	const contactId = (await params).id;

	try {
		// 1. Fetch the contact with related data
		const contact = await payload.findByID({
			collection: "provider-contacts",
			id: contactId,
			depth: 2,
		});

		if (!contact) {
			return NextResponse.json({ error: "Contact not found" }, { status: 404 });
		}

		// Only proceed if provider is verified
		if (contact.serviceProvider.visibility?.status !== "Verified") {
			return NextResponse.json({
				error: "Provider is not verified",
				status: 400,
			});
		}

		// 2. Generate file download link for the single file
		const fileLink = contact.project.file
			? {
					name: "Project document",
					url: contact.project.file.value.remoteURL,
				}
			: null;

		// 3. Send email to provider with all information
		await messageService.send({
			template: "VERIFIED_CONTACT_REQUEST",
			recipient: {
				email: contact.email,
			},
			data: {
				client_first_name: contact.firstName,
				client_last_name: contact.lastName,
				client_email: contact.email,
				client_telegram: contact.telegramUsername,
				project_description: contact.project.description,
				additional_notes: contact.project.additionalDescription,
				budget:
					SERVICE_PROVIDER_BUDGET_OPTIONS.find(
						(option) => option.value === contact.project.budget,
					)?.label ?? "Missing information",
				project_timeline:
					SERVICE_PROVIDER_TIMELINE_OPTIONS.find(
						(option) => option.value === contact.project.timeline,
					)?.label ?? "Missing information",
				required_services: contact.project.services
					.map((s) => s.value.name)
					.join(", "),
				file_link_name: fileLink?.name ?? "",
				file_link_url: fileLink?.url ?? "",
				preferred_crypto: contact.cashback.crypto,
				wallet_address: contact.cashback.walletAddress,
			},
		});

		// 4. Update contact status to completed
		await payload.update({
			collection: "provider-contacts",
			id: contactId,
			data: {
				status: "completed",
				completedAt: new Date().toISOString(),
			},
		});

		return NextResponse.json({
			success: true,
			message: "Contact process completed successfully",
		});
	} catch (error) {
		logger.error({
			msg: "Failed to complete contact process",
			err: error instanceof Error ? error : new Error(String(error)),
			metadata: {
				contactId,
			},
		});

		return NextResponse.json(
			{ error: "Failed to complete contact process" },
			{ status: 500 },
		);
	}
}
