import type { EmailAdapter, SendEmailOptions } from "payload";
import { APIError } from "payload";

// Adapter Configuration Types
export type PostmarkAdapterArgs = {
	apiKey: string;
	defaultFromAddress: string;
	defaultFromName: string;
	templates?: Record<string, string>;
};

export type PostmarkAdapter = EmailAdapter<PostmarkResponse>;

// Response and Error Types
type PostmarkResponse = {
	To: string;
	SubmittedAt: string;
	MessageID: string;
	ErrorCode: number;
	Message: string;
};

type PostmarkError = {
	ErrorCode: number;
	Message: string;
};

// Email Options Types
type BaseEmailOptions = {
	From: string;
	To: string;
	Cc?: string;
	Bcc?: string;
	Tag?: string;
	ReplyTo?: string;
	Headers?: Array<{ Name: string; Value: string }>;
	TrackOpens?: boolean;
	TrackLinks?: "None" | "HtmlAndText" | "HtmlOnly" | "TextOnly";
	Attachments?: Array<{
		Name: string;
		Content: string;
		ContentType: string;
		ContentID?: string;
	}>;
	Metadata?: Record<string, string>;
	MessageStream?: string;
};

type PostmarkSendEmailOptions = BaseEmailOptions & {
	Subject: string;
	HtmlBody?: string;
	TextBody?: string;
};

type PostmarkTemplateEmailOptions = BaseEmailOptions & {
	TemplateId: string;
	TemplateModel: Record<string, unknown>;
};

// Main Adapter Implementation
export const postmarkAdapter = (args: PostmarkAdapterArgs): PostmarkAdapter => {
	const { apiKey, defaultFromAddress, defaultFromName, templates = {} } = args;

	const adapter: PostmarkAdapter = () => ({
		name: "postmark-client",
		defaultFromAddress,
		defaultFromName,
		sendEmail: async (message: SendEmailOptions) => {
			try {
				if (message.template) {
					const templateId = templates[message.template];
					if (!templateId) {
						throw new APIError(`Template "${message.template}" not found`, 400);
					}

					return await sendTemplateEmail(
						mapToTemplateEmail(
							message,
							templateId,
							defaultFromName,
							defaultFromAddress,
						),
						apiKey,
					);
				}

				return await sendRegularEmail(
					mapPayloadEmailToPostmarkEmail(
						message,
						defaultFromName,
						defaultFromAddress,
					),
					apiKey,
				);
			} catch (error) {
				if (error instanceof APIError) {
					throw error;
				}
				throw new APIError(
					`Failed to send email: ${error instanceof Error ? error.message : "Unknown error"}`,
					500,
				);
			}
		},
	});

	return adapter;
};

// HTTP Request Handler
async function makePostmarkRequest(
	endpoint: string,
	data: PostmarkSendEmailOptions | PostmarkTemplateEmailOptions,
	apiKey: string,
): Promise<PostmarkResponse> {
	const res = await fetch(`https://api.postmarkapp.com/${endpoint}`, {
		method: "POST",
		headers: {
			Accept: "application/json",
			"Content-Type": "application/json",
			"X-Postmark-Server-Token": apiKey,
		},
		body: JSON.stringify(data),
	});

	const responseData = (await res.json()) as PostmarkResponse | PostmarkError;

	if (!res.ok) {
		const error = responseData as PostmarkError;
		throw new APIError(
			`Error sending email: ${error.Message}`,
			error.ErrorCode,
		);
	}

	return responseData as PostmarkResponse;
}

// Email Sending Functions
async function sendRegularEmail(
	options: PostmarkSendEmailOptions,
	apiKey: string,
): Promise<PostmarkResponse> {
	return makePostmarkRequest("email", options, apiKey);
}

async function sendTemplateEmail(
	options: PostmarkTemplateEmailOptions,
	apiKey: string,
): Promise<PostmarkResponse> {
	return makePostmarkRequest("email/withTemplate", options, apiKey);
}

// Mapping Functions
function mapPayloadEmailToPostmarkEmail(
	message: SendEmailOptions,
	defaultFromName: string,
	defaultFromAddress: string,
): PostmarkSendEmailOptions {
	return {
		From: mapFromAddress(message.from, defaultFromName, defaultFromAddress),
		To: mapAddresses(message.to),
		Subject: message.subject || "",
		HtmlBody: message.html?.toString() || undefined,
		TextBody: message.text?.toString() || undefined,
		Cc: mapAddresses(message.cc),
		Bcc: mapAddresses(message.bcc),
		ReplyTo: message.replyTo ? mapAddresses(message.replyTo) : undefined,
		Attachments: mapAttachments(message.attachments),
	};
}

function mapToTemplateEmail(
	message: SendEmailOptions,
	templateId: string,
	defaultFromName: string,
	defaultFromAddress: string,
): PostmarkTemplateEmailOptions {
	return {
		TemplateId: templateId,
		TemplateModel: message.data || {},
		From: mapFromAddress(message.from, defaultFromName, defaultFromAddress),
		To: mapAddresses(message.to),
		Cc: mapAddresses(message.cc),
		Bcc: mapAddresses(message.bcc),
		ReplyTo: message.replyTo ? mapAddresses(message.replyTo) : undefined,
		Attachments: mapAttachments(message.attachments),
	};
}

/**
 * Maps the email address format from Payload to Postmark format
 * Handles three cases:
 * 1. No address provided (uses defaults)
 * 2. String address
 * 3. Object with name and address
 */
function mapFromAddress(
	from: SendEmailOptions["from"],
	defaultFromName: string,
	defaultFromAddress: string,
): string {
	if (!from) {
		return `${defaultFromName} <${defaultFromAddress}>`;
	}

	if (typeof from === "string") {
		return from;
	}

	return `${from.name} <${from.address}>`;
}

/**
 * Maps multiple email addresses from Payload to Postmark format
 * Handles single address, multiple addresses, and address objects
 */
function mapAddresses(
	addresses:
		| SendEmailOptions["to"]
		| SendEmailOptions["cc"]
		| SendEmailOptions["bcc"]
		| SendEmailOptions["replyTo"],
): string | undefined {
	if (!addresses) {
		return undefined;
	}

	if (typeof addresses === "string") {
		return addresses;
	}

	if (Array.isArray(addresses)) {
		return addresses
			.map((address) =>
				typeof address === "string"
					? address
					: `${address.name} <${address.address}>`,
			)
			.join(",");
	}

	return addresses.address;
}

/**
 * Maps attachments from Payload format to Postmark format
 * Handles Buffer and string content types, converting to base64
 */
function mapAttachments(
	attachments?: SendEmailOptions["attachments"],
): PostmarkSendEmailOptions["Attachments"] | undefined {
	if (!attachments || attachments.length === 0) {
		return undefined;
	}

	return attachments.map((attachment) => {
		if (!attachment.filename || !attachment.content) {
			throw new APIError("Attachment is missing filename or content", 400);
		}

		let content: string;
		if (attachment.content instanceof Buffer) {
			content = attachment.content.toString("base64");
		} else if (typeof attachment.content === "string") {
			content = Buffer.from(attachment.content).toString("base64");
		} else {
			throw new APIError("Attachment content must be a string or buffer", 400);
		}

		return {
			Name: attachment.filename,
			Content: content,
			ContentType: attachment.contentType || "application/octet-stream",
		};
	});
}
