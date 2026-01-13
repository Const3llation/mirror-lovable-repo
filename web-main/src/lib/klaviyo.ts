if (!process.env.KLAVIYO_PRIVATE_API_KEY) {
	throw new Error("KLAVIYO_PRIVATE_API_KEY is not defined");
}
export async function subscribeToNewsletter(email: string, listId: string) {
	if (!process.env.KLAVIYO_PRIVATE_API_KEY) {
		throw new Error("KLAVIYO_PRIVATE_API_KEY is not defined");
	}

	const requestBody = {
		method: "POST",
		headers: {
			Authorization: `Klaviyo-API-Key ${process.env.KLAVIYO_PRIVATE_API_KEY}`,
			accept: "application/vnd.api+json",
			"content-type": "application/vnd.api+json",
			revision: "2025-01-15",
		},
		body: JSON.stringify({
			data: {
				type: "profile-subscription-bulk-create-job",
				attributes: {
					profiles: {
						data: [
							{
								type: "profile",
								attributes: {
									email,
									subscriptions: {
										email: {
											marketing: {
												consent: "SUBSCRIBED",
											},
										},
									},
								},
							},
						],
					},
					historical_import: false,
				},
				relationships: {
					list: {
						data: {
							type: "list",
							id: listId,
						},
					},
				},
			},
		}),
	};

	return await fetch(
		"https://a.klaviyo.com/api/profile-subscription-bulk-create-jobs/",
		requestBody,
	);
}
