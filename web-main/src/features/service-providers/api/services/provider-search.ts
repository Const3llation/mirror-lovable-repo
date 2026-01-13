import type { GetServiceProvidersRequest } from "@/features/service-providers/api/schemas/providers";
import { buildProviderQuery } from "@/features/service-providers/queries/build-provider-query";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import type { ServiceProvider } from "@/types/payload";
import type { PaginatedDocs } from "payload";

export const searchProviders = async (
	filters: GetServiceProvidersRequest,
): Promise<PaginatedDocs<ServiceProvider>> => {
	const query = buildProviderQuery(filters);
	logger.info({ msg: "Provider search query", query });
	const results = await payload.find(query);

	// Handle reviews if requested
	if (filters.reviews && results.docs.length === 1) {
		const provider = results.docs[0];
		const reviews = await payload.find({
			collection: "provider-reviews",
			where: { serviceProvider: { equals: provider.id } },
		});

		// @ts-expect-error - reviews will be added to the provider object
		provider.reviews = reviews.docs?.map((review) => ({
			id: review.id,
			firstName: review.firstName,
			lastName: review.lastName,
			review: review.review,
			categories: review.project.services.map((service) => service.value),
		}));
	}

	return results;
};
