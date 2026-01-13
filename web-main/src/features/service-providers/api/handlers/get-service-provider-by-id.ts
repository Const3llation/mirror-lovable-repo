import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";
import type { ServiceProvider } from "@/types/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";
import {
	type PublicServiceProvider,
	transformToPublicProvider,
} from "../transforms/provider-transform";

const pathParamsSchema = z.object({
	id: z.string(),
});

type ServiceProviderResponse = {
	provider: PublicServiceProvider | null;
};

export const getServiceProviderById = createApiRoute<
	Record<string, never>,
	ServiceProvider | null,
	ServiceProviderResponse
>(
	{
		method: "GET",
		pathParamSchema: pathParamsSchema,
		rateLimiter: new RateLimiter(20, 60),
		responseDTO: (data: ServiceProvider | null) => ({
			provider: data ? transformToPublicProvider(data) : null,
		}),
	},
	async (_req, _input, promiseParams) => {
		const { id } = await promiseParams;
		logger.debug({ msg: "Fetching service provider", id });

		const provider = await payload.findByID({
			collection: "service-providers",
			id,
			depth: 2,
		});

		return provider;
	},
);
