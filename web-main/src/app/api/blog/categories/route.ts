import getCategories from "@/features/blog/api/get-categories";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

export const GET = createApiRoute(
	{
		method: "GET",
		responseDTO: z.any(),
	},
	async () => {
		const blogCategories = await getCategories();

		return blogCategories.map((category) => ({
			id: category.id.toString(),
			label: category.label,
			value: category.value,
		}));
	},
);
