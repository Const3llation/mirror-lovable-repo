import getPosts from "@/features/blog/api/get-posts";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const querySchema = z.object({
	category: z.string().optional(),
	page: z.string().default("1"),
});

export const GET = createApiRoute(
	{
		method: "GET",
		schema: querySchema,
		responseDTO: z.any(),
	},
	async (_, input) => {
		const { blogPosts, pagination } = await getPosts(
			input.category ?? null,
			input.page ?? "1",
		);
		return { data: blogPosts, pagination };
	},
);
