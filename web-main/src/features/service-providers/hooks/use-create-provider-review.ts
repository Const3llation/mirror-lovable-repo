import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";
import type { serviceProvidersReviewFormSchema } from "../schemas/review";

type ReviewFormData = z.infer<typeof serviceProvidersReviewFormSchema>;

async function createReview(
	data: ReviewFormData & { serviceProviderSlug: string },
) {
	const response = await fetch("/api/providers/review", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(data),
	});

	if (!response.ok) {
		const error = await response.json();
		throw new Error(error.message || "Failed to create review");
	}

	return response.json();
}

export function useCreateReview() {
	return useMutation({
		mutationFn: createReview,
	});
}
