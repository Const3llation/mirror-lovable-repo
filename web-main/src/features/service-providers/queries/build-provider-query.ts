import type { GetServiceProvidersRequest } from "@/features/service-providers/api/schemas/providers";

// TODO: Fix this type, should be payload query type
type Query = Record<string, unknown>;

type QueryBuilder = (query: Query) => Query;

export const withBaseFilters = (): QueryBuilder => (query) => ({
	...query,
	where: {
		...(query.where || {}),
		"visibility.published": {
			equals: "Yes",
		},
		"visibility.waitingForModeration": {
			equals: "No",
		},
	},
});

export const withEmailFilter =
	(email?: string | null): QueryBuilder =>
	(query) =>
		email
			? {
					...query,
					where: {
						...(query.where || {}),
						email: { equals: email.toLowerCase() },
					},
				}
			: query;

export const withSlugFilter =
	(slug?: string | null): QueryBuilder =>
	(query) =>
		slug
			? {
					...query,
					where: {
						...(query.where || {}),
						slug: { equals: slug.toLowerCase() },
					},
				}
			: query;

export const withRegistrationStatus =
	(status?: string | null): QueryBuilder =>
	(query) =>
		status
			? {
					...query,
					where: {
						...(query.where || {}),
						registrationProcessStatus: { equals: status },
					},
				}
			: query;

export const withCategoryFilter =
	(category?: string | null): QueryBuilder =>
	(query) =>
		category && category !== "all"
			? {
					...query,
					where: {
						...(query.where || {}),
						"categories.categories.slug": {
							equals: category,
						},
					},
				}
			: query;

export const buildProviderQuery = (
	filters: GetServiceProvidersRequest,
): Query => {
	const baseQuery: Query = {
		collection: "service-providers",
		depth: Number.parseInt(filters.depth ?? "1"),
		limit: Number.parseInt(filters.limit ?? "50"),
	};

	// Used when creating new provider to enable users
	// to continue where they left off
	const isTargetedSearch = !!filters.email || !!filters.slug;

	const builders = [
		isTargetedSearch ? null : withBaseFilters(),
		withEmailFilter(filters.email),
		withSlugFilter(filters.slug),
		withRegistrationStatus(filters.registrationProcessStatus),
		withCategoryFilter(filters.category),
	].filter(Boolean) as QueryBuilder[];

	return builders.reduce((query, builder) => builder(query), baseQuery);
};
