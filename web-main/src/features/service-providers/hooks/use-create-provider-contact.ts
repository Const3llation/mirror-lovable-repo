import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import type { serviceProvidersContactFormSchema } from "../schemas/contact";

type ContactFormData = z.infer<typeof serviceProvidersContactFormSchema>;

async function createContact(
	data: ContactFormData & { serviceProviderSlug: string },
) {
	const response = await fetch("/api/providers/contact", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create contact");
	}

	return response.json();
}

export function useCreateContact() {
	return useMutation({
		mutationFn: createContact,
	});
}
