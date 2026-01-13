import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

export const GET = createApiRoute(
	{
		method: "GET",
		responseDTO: z.any(),
	},
	async () => {
		const results = await payload.find({
			collection: "help-center-items",
			sort: "createdAt",
		});

		return results;
	},
);
