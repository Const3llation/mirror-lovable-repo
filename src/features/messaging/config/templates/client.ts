export const CLIENT_TEMPLATES = {
	CONTACT_RECEIVED: {
		alias: "client-provider-contact-received",
		description: "Confirmation to client that contact request was received",
		requiredFields: {
			provider_name: {} as string,
		},
	},
} as const;
