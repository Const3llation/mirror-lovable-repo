import {
	type GetServiceProvidersRequest,
	providersSearch,
} from "@/features/service-providers/api/schemas/providers";
import { searchProviders } from "@/features/service-providers/api/services/provider-search";
import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";
import type { ServiceProvider } from "@/types/payload";
import { createApiRoute } from "@/utils/create-api-route";
import type { PaginatedDocs } from "payload";
import {
	type PublicServiceProvider,
	transformToPublicProvider,
} from "../transforms/provider-transform";

type PaginatedPublicServiceProviders = Omit<
	PaginatedDocs<ServiceProvider>,
	"docs"
> & {
	docs: PublicServiceProvider[];
};

export const getServiceProviders = createApiRoute<
	GetServiceProvidersRequest,
	PaginatedDocs<ServiceProvider>,
	PaginatedPublicServiceProviders
>(
	{
		method: "GET",
		schema: providersSearch,
		rateLimiter: new RateLimiter(30, 60),
		responseDTO: (
			data: PaginatedDocs<ServiceProvider>,
		): PaginatedPublicServiceProviders => ({
			...data,
			docs: data.docs.map(transformToPublicProvider),
		}),
	},
	async (_req, filters) => {
		return await searchProviders(filters);
	},
);
