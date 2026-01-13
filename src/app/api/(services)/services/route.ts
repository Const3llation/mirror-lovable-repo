import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const categoriesSearchSchema = z.object({
	depth: z.enum(["1", "2"]).optional(),
	sortByChildCount: z.enum(["true", "false"]).optional(),
	limit: z.string().optional(),
});

type CategoriesSearchOptions = z.infer<typeof categoriesSearchSchema>;

const getCategories = async (
	depth: CategoriesSearchOptions["depth"] = "2",
	limit = "100",
) => {
	try {
		const { docs, totalDocs, totalPages, page, hasNextPage, hasPrevPage } =
			await payload.find({
				collection: "categories",
				depth: Number.parseInt(depth) ?? 2,
				limit: Number.parseInt(limit) ?? 100,
				sort: "name",
			});

		return {
			docs,
			totalDocs,
			limit,
			totalPages,
			page,
			hasNextPage,
			hasPrevPage,
		};
	} catch (error) {
		console.error("Error fetching categories:", error);
		throw error;
	}
};

// Define response type schema
const categoryResponseSchema = z.object({
	docs: z.array(z.any()), // Replace with proper category type if available
	totalDocs: z.number(),
	limit: z.string(),
	totalPages: z.number(),
	page: z.number(),
	hasNextPage: z.boolean(),
	hasPrevPage: z.boolean(),
});

export const GET = createApiRoute(
	{
		method: "GET",
		schema: categoriesSearchSchema,
		responseDTO: categoryResponseSchema,
		rateLimiter: true,
	},
	async (req, input) => {
		let { docs: categories, ...paginationData } = await getCategories(
			input.depth,
			input.limit,
		);

		if (input.sortByChildCount === "true" && categories.length > 0) {
			categories = [...categories].sort((a, b) => {
				const aCount = a.subCategories?.length || 0;
				const bCount = b.subCategories?.length || 0;
				return bCount - aCount;
			});
		}

		return {
			docs: categories,
			...paginationData,
		};
	},
);
