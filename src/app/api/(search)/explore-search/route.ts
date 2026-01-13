import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const DEFAULT_SORT_PRIORITY = [
	"visibility.status",
	"reviewsAverage",
	"reviewsCount",
] as const;

const SortByEnum = z.enum([
	"verified",
	"user_rating_low_to_high",
	"user_rating_high_to_low",
] as const);

const searchParamsSchema = z
	.object({
		services: z.string().optional(),
		subServices: z.string().optional(),
		budgets: z.string().optional(),
		locations: z.string().optional(),
		ratings: z.string().optional(),
		page: z.string().optional(),
		limit: z.string().optional(),
		sortBy: SortByEnum.optional(),
	})
	.transform((data) => ({
		services: data.services?.split(",").filter(Boolean) ?? [],
		subServices: data.subServices?.split(",").filter(Boolean) ?? [],
		budgets: data.budgets?.split(",").filter(Boolean) ?? [],
		locations: data.locations?.split(",").filter(Boolean) ?? [],
		ratings: data.ratings?.split(",").filter(Boolean).map(Number) ?? [],
		page: data.page ? Number.parseInt(data.page, 10) : 1,
		limit: data.limit ? Number.parseInt(data.limit, 10) : 10,
		sortBy: data.sortBy,
	}));

const responseSchema = z.object({
	docs: z.array(z.any()),
	totalDocs: z.number(),
	totalPages: z.number(),
	page: z.number(),
	hasNext: z.boolean(),
	hasPrev: z.boolean(),
	limit: z.number(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

const handler = async (req: Request, input: SearchParams) => {
	const {
		services,
		subServices,
		budgets,
		locations,
		ratings,
		page,
		limit,
		sortBy,
	} = input;

	const where: {
		and: Array<{ [key: string]: { [operator: string]: unknown } }>;
	} = {
		and: [{ "visibility.published": { equals: "Yes" } }],
	};

	if (services.length > 0) {
		const numericServiceIds = services
			.filter((s) => !Number.isNaN(Number(s)))
			.map(Number);

		if (numericServiceIds.length > 0) {
			where.and.push({
				"categories.categories": {
					in: numericServiceIds,
				},
			});
		}
	}

	if (subServices.length > 0) {
		const numericSubServiceIds = subServices
			.filter((s) => !Number.isNaN(Number(s)))
			.map(Number);

		if (numericSubServiceIds.length > 0) {
			where.and.push({
				"categories.subCategories": {
					in: numericSubServiceIds,
				},
			});
		}
	}

	if (budgets.length > 0) {
		if (!budgets.includes("all")) {
			where.and.push({ minimumBudget: { in: budgets } });
		}
	}

	if (locations.length > 0) {
		where.and.push({ "addresses.country": { in: locations } });
	}

	if (ratings.length > 0) {
		where.and.push({
			reviewsAverage: {
				in: ratings.flatMap((rating) => [rating - 0.25, rating + 0.25]),
			},
		});
	}

	// Define sort order based on sortBy parameter
	let sort: string[] = [];
	switch (sortBy) {
		case "verified":
			sort = [
				"visibility.status",
				...DEFAULT_SORT_PRIORITY.filter(
					(field) => field !== "visibility.status",
				),
			];
			break;
		case "user_rating_low_to_high":
			sort = [
				"-reviewsAverage",
				...DEFAULT_SORT_PRIORITY.filter((field) => field !== "reviewsAverage"),
			];
			break;
		case "user_rating_high_to_low":
			sort = [...DEFAULT_SORT_PRIORITY];
			break;
		default:
			sort = [...DEFAULT_SORT_PRIORITY];
	}

	const result = await payload.find({
		collection: "service-providers",
		where,
		page,
		limit,
		sort,
		depth: 2,
	});

	return {
		docs: result.docs,
		totalDocs: result.totalDocs,
		totalPages: result.totalPages,
		page: result.page,
		hasNext: result.hasNextPage,
		hasPrev: result.hasPrevPage,
		limit,
	};
};

export const GET = createApiRoute(
	{
		method: "GET",
		schema: searchParamsSchema,
		responseDTO: responseSchema,
	},
	handler,
);
