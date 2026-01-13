export const PROVIDER_TEMPLATES = {
	VERIFIED_CONTACT_REQUEST: {
		alias: "provider-verified-contact-request",
		description: "Contact request notification for verified providers",
		requiredFields: {
			client_first_name: {} as string,
			client_last_name: {} as string,
			client_email: {} as string,
			client_telegram: {} as string,
			project_description: {} as string,
			additional_notes: {} as string,
			budget: {} as string,
			project_timeline: {} as string,
			required_services: {} as string,
			file_link_url: {} as string,
			file_link_name: {} as string,
			preferred_crypto: {} as string,
			wallet_address: {} as string,
		},
	},

	EMAIL_VERIFICATION: {
		alias: "provider-email-verification",
		description: "Email verification code for providers",
		requiredFields: {
			code: {} as string,
			expires_in: {} as string,
		},
	},

	REGISTRATION_WELCOME: {
		alias: "provider-registration-welcome",
		description: "Welcome email to providers after registration",
		requiredFields: {
			name: {} as string,
		},
	},
} as const;
