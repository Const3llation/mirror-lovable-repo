import { SLUGS } from "@/config/consts";
import payload from "@/lib/payload";
import type { Category, ServiceProvider } from "@/types/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

// Input schema
const searchParamsSchema = z.object({
	q: z.string().min(2),
	providersLimit: z.string().optional(),
});

type SearchParams = z.infer<typeof searchParamsSchema>;

const providerSchema = z.object({
	id: z.preprocess((val) => String(val), z.string()),
	providerName: z.string(),
	slug: z.string(),
	region: z.preprocess((val) => val ?? null, z.string().nullable()),
	country: z.preprocess((val) => val ?? null, z.string().nullable()),
	companySize: z.preprocess((val) => val ?? null, z.string().nullable()),
	status: z.preprocess((val) => val ?? null, z.string().nullable()),
});

const subCategorySchema = z.object({
	id: z.preprocess((val) => String(val), z.string()),
	name: z.string(),
	slug: z.string(),
});

const categorySchema = z.object({
	id: z.preprocess((val) => String(val), z.string()),
	name: z.string(),
	icon: z.preprocess((val) => {
		if (typeof val === "object" && val !== null && "url" in val) {
			return (val as { url: string }).url;
		}
		return val;
	}, z.string()),
	slug: z.string(),
	subCategories: z.array(subCategorySchema),
});

// TODO: Finish response schema type
const responseSchema = z.object({
	providers: z.array(providerSchema),
	categories: z.array(categorySchema),
	total: z.object({
		providers: z.number(),
		categories: z.number(),
	}),
});

class CategoryProcessor {
	private categoryScores = new Map<
		string,
		{ category: Category; score: number }
	>();

	private searchTerm: string;

	constructor(searchTerm: string) {
		this.searchTerm = searchTerm.toLowerCase();
	}

	process(providers: ServiceProvider[]) {
		for (const provider of providers) {
			if (provider.categories?.categories) {
				for (const category of provider.categories.categories as Category[]) {
					this.#processCategory(category);
				}
			}
		}
	}

	getSortedCategories(): Category[] {
		const sorted = Array.from(this.categoryScores.values())
			.sort((a, b) => b.score - a.score)
			.map((item) => item.category);
		return this.#sortSubCategories(sorted);
	}

	#processCategory(originalCategory: Category) {
		const categoryId = String(originalCategory.id);

		if (!this.categoryScores.has(categoryId)) {
			// Deep copy and process only once
			const category = JSON.parse(JSON.stringify(originalCategory));
			const score = this.#calculateScore(category);
			this.categoryScores.set(categoryId, { category, score });
		}
	}

	#calculateScore(category: Category): number {
		let score = 0;
		const categoryName = category.name?.toLowerCase() || "";
		if (categoryName.includes(this.searchTerm)) {
			score += 10;
		}

		if (
			category.subCategories?.some(
				(sub) =>
					typeof sub === "object" &&
					sub.name?.toLowerCase().includes(this.searchTerm),
			)
		) {
			score += 5;
		}

		return score;
	}

	#sortSubCategories(categories: Category[]): Category[] {
		for (const category of categories) {
			if (category.subCategories?.length) {
				category.subCategories.sort((a, b) => {
					const aName =
						typeof a === "object" ? a.name?.toLowerCase() || "" : "";
					const bName =
						typeof b === "object" ? b.name?.toLowerCase() || "" : "";
					const aIsRelevant = aName.includes(this.searchTerm);
					const bIsRelevant = bName.includes(this.searchTerm);

					if (aIsRelevant && !bIsRelevant) return -1;
					if (!aIsRelevant && bIsRelevant) return 1;
					return 0;
				});
			}
		}
		return categories;
	}
}

const handler = async (req: Request, input: SearchParams) => {
	const { q, providersLimit: providersLimitStr } = input;
	const providersLimit = Number(providersLimitStr ?? "5");

	const searchResults = await payload.find({
		collection: "search",
		where: {
			searchableText: {
				like: q,
			},
		},
		limit: providersLimit,
	});

	if (searchResults.docs.length === 0) {
		return {
			providers: [],
			categories: [],
			total: {
				providers: 0,
				categories: 0,
			},
		};
	}

	// Extract provider IDs from search results
	const providerIds = searchResults.docs
		.map((doc) => {
			// NOTE: This is a workaround for local development.
			// Not all search items have service provider relation.
			if (doc.doc?.value) {
				return String(doc.doc.value);
			}
			return null;
		})
		.filter(Boolean);

	const fullProviders = await payload.find({
		collection: SLUGS.serviceProviders,
		where: {
			id: {
				in: providerIds,
			},
			"visibility.published": {
				equals: "Yes",
			},
			"visibility.waitingForModeration": {
				equals: "No",
			},
		},
		depth: 2,
	});

	// Create a map to store categories with their relevance scores
	const categoryProcessor = new CategoryProcessor(q);
	categoryProcessor.process(fullProviders.docs as ServiceProvider[]);
	const sortedCategories = categoryProcessor.getSortedCategories();

	return {
		providers: fullProviders.docs,
		categories: sortedCategories,
		total: {
			providers: fullProviders.totalDocs,
			categories: sortedCategories.length,
		},
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
