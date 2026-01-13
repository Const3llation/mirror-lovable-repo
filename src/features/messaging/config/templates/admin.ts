export const ADMIN_TEMPLATES = {
	PROVIDER_VERIFY_REQUEST: {
		alias: "admin-profile-verify-request",
		description: "Admin notification for provider verification request",
		requiredFields: {
			first_name: {} as string,
			last_name: {} as string,
			work_email: {} as string,
			position: {} as string,
			request_date: {} as string,
			cms_verification_url: {} as string,
			provider_name: {} as string,
		},
	},

	PROVIDER_REGISTRATION: {
		alias: "admin-provider-registration-success",
		description: "Admin notification for new provider registration",
		requiredFields: {
			provider_name: {} as string,
			provider_email: {} as string,
			registration_date: {} as string,
			cms_profile_url: {} as string,
		},
	},

	UNVERIFIED_CONTACT_REQUEST: {
		alias: "admin-unverified-provider-contact-request",
		description: "Admin notification for unverified provider contact request",
		requiredFields: {
			provider_name: {} as string,
			client_name: {} as string,
			client_email: {} as string,
			request_date: {} as string,
			cms_request_url: {} as string,
		},
	},
} as const;
