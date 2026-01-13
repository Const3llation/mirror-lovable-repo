import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const globalsSearchSchema = z.object({
	slug: z.enum(["main-navigation", "footer"]),
});

const globalsResponseSchema = z.any();

export const GET = createApiRoute(
	{
		method: "GET",
		schema: globalsSearchSchema,
		responseDTO: globalsResponseSchema,
		rateLimiter: true,
	},
	async (_req, input) => {
		const data = await payload.findGlobal({
			slug: input.slug,
		});

		return data;
	},
);
