import logger from "@/lib/logger";
import payload from "@/lib/payload";
import type { MessageData, MessageService, TemplateKey } from "../types";
import { TemplateService } from "./template-service";

export interface EmailProvider {
	sendEmail(params: {
		to: string;
		template: string;
		data: Record<string, unknown>;
	}): Promise<void>;
}

export class PayloadEmailProvider implements EmailProvider {
	constructor(private readonly payloadClient: typeof payload) {}

	async sendEmail(params: {
		to: string;
		template: string;
		data: Record<string, unknown>;
	}): Promise<void> {
		try {
			await this.payloadClient.sendEmail({
				to: params.to,
				template: params.template,
				data: params.data,
			});
		} catch (error) {
			console.error("Email provider error details:", {
				template: params.template,
				error: error instanceof Error ? error.message : error,
			});
			throw new Error(
				`Email sending failed: ${error instanceof Error ? error.message : "Unknown error"}`,
			);
		}
	}
}

export class MessageServiceImpl implements MessageService {
	constructor(
		private readonly emailProvider: EmailProvider,
		private readonly templateService: TemplateService,
	) {}

	async send<T extends TemplateKey>(message: MessageData<T>): Promise<void> {
		const { template, recipient, data } = message;
		const templateConfig = this.templateService.getTemplate(template);

		// Validate template data
		if (!this.templateService.validateTemplateData(template, data)) {
			throw new Error(`Invalid template data for template ${template}`);
		}

		// Merge with shared data
		const mergedData = this.templateService.mergeWithSharedData(data);

		logger.info("Attempting to send email", {
			template,
			emailData: {
				recipient: recipient.email,
				templateAlias: templateConfig.alias,
			},
		});

		try {
			await this.emailProvider.sendEmail({
				to: recipient.email,
				template: templateConfig.alias,
				data: {
					recipient_name: recipient.name,
					...mergedData,
				},
			});

			logger.info("Email sent successfully", {
				template,
				emailData: {
					recipient: recipient.email,
				},
			});
		} catch (error) {
			logger.error("Failed to send email", {
				error,
				template,
				emailData: {
					recipient: recipient.email,
				},
			});
			throw error;
		}
	}
}

const payloadEmailProvider = new PayloadEmailProvider(payload);
export const messageService = new MessageServiceImpl(
	payloadEmailProvider,
	new TemplateService(),
);
