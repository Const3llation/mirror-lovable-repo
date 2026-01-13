import { SLUGS } from "@/config/consts";
import {
	isAdmin,
	isInfrastructure,
} from "@/features/auth/api/access/baseAccess";
import type { Category, ServiceProvider, SubCategory } from "@/types/payload";
import { getCountryForCode, getRegionForCountry } from "@/utils/country";
import { searchPlugin } from "@payloadcms/plugin-search";
import type { BeforeSync } from "@payloadcms/plugin-search/types";
import type { TCountryCode } from "countries-list";
import type { Payload } from "payload";
import { match } from "ts-pattern";

type SyncCollection = (typeof SLUGS)[keyof typeof SLUGS];

const getCategoryName = (category: Category | SubCategory): string => {
	if (!category) return "";
	return category.name ?? "";
};

const getHeadquarterCountryOrFirstCountry = (
	addresses: ServiceProvider["addresses"],
) => {
	if (!addresses?.length) return null;
	return (addresses.find((address) => address.addressType === "Headquarters")
		?.country || addresses[0].country) as TCountryCode;
};

type FetchCategoriesAndSubCategoriesForProviderParams = {
	payload: Payload;
	providerId: string;
	categories: string[] | Category[];
	subCategories: SubCategory["id"][] | SubCategory[];
};

const getId = (
	item: string | number | Category | SubCategory,
): string | number => {
	return typeof item === "object" ? item.id : item;
};

// TODO: Consider separating .find calls into separate functions / services	s
const fetchCategoriesAndSubCategoriesForProvider = async ({
	payload,
	categories,
	subCategories,
}: FetchCategoriesAndSubCategoriesForProviderParams) => {
	const categoriesIds = categories.map(getId);
	const subCategoriesIds = subCategories.map(getId);

	const categoriesResult = await payload.find({
		collection: SLUGS.categories,
		where: {
			id: {
				in: categoriesIds,
			},
		},
	});

	const subCategoriesResult = await payload.find({
		collection: SLUGS.subCategories,
		where: {
			id: {
				in: subCategoriesIds,
			},
		},
	});

	return {
		categories: categoriesResult.docs,
		subCategories: subCategoriesResult.docs,
	};
};

type SearchDocumentTransformData = {
	title: string;
	region: string | null;
	country: string | null;
	categories: string;
	subCategories: string;
	companySize: string | null;
	status: string | null;
};

const getSearchableText = (doc: SearchDocumentTransformData) => {
	const fields = [
		doc.title,
		doc.region,
		doc.country,
		doc.companySize,
		doc.status,
		doc.categories,
		doc.subCategories,
	];

	return fields.filter(Boolean).join(" ").toLowerCase();
};

/**
 * This function is used to update the search document before it is synced to the search index.
 *
 * @param args - The arguments object containing the following properties:
 * @param args.searchDoc - The document that will be indexed, containing search-specific fields and metadata
 * @param args.originalDoc - The original document from the collection before any search transformations
 * @param args.collection - The collection configuration object for the document being indexed
 * @param args.operation - The type of operation being performed ('create' | 'update' | 'delete')
 *
 * @returns The updated search document that will be indexed
 */
const beforeSync: BeforeSync = async ({
	searchDoc,
	originalDoc: updatedCollection,
	payload,
}) => {
	try {
		const collection = searchDoc.doc.relationTo as SyncCollection;

		const updatedSearchDoc = await match(collection)
			.with(SLUGS.serviceProviders, async () => {
				const providerId = updatedCollection.id;

				const addressCountry = getHeadquarterCountryOrFirstCountry(
					updatedCollection.addresses,
				);

				const { categories, subCategories } =
					await fetchCategoriesAndSubCategoriesForProvider({
						categories: updatedCollection.categories.categories,
						subCategories: updatedCollection.categories.subCategories,
						payload,
						providerId,
					});

				const result = {
					title: updatedCollection.providerName,
					region: addressCountry ? getRegionForCountry(addressCountry) : null,
					country: addressCountry ? getCountryForCode(addressCountry) : null,
					categories: categories.map(getCategoryName).join(" "),
					subCategories: subCategories.map(getCategoryName).join(" "),
					companySize: updatedCollection.companySize,
					status: updatedCollection.status,
					minimumBudget: updatedCollection.minimumBudget,
					reviewsAverage: updatedCollection.reviewsAverage,
				};

				return {
					...result,
					searchableText: getSearchableText(result),
				};
			})
			.with(SLUGS.categories, SLUGS.subCategories, async () => {
				const field =
					collection === SLUGS.categories
						? "categories.categories"
						: "categories.subCategories";

				// TODO: pagination could be an issue here
				const associatedCompanies = await payload.find({
					collection: SLUGS.serviceProviders,
					where: {
						[field]: {
							contains: updatedCollection.id,
						},
					},
				});

				const companyNames = associatedCompanies.docs.map(
					(company) => company.providerName,
				);
				const companyNamesString = companyNames.join(" ");

				return {
					title: updatedCollection.name,
					searchableText: `${updatedCollection.name} ${companyNamesString}`,
					region: null,
					country: null,
					categories: [],
					subCategories: [],
					companySize: null,
				};
			})
			.otherwise(() => ({
				title: "Untitled",
				searchableText: "",
				region: null,
				country: null,
				categories: [],
				subCategories: [],
				companySize: null,
				status: null,
			}));

		const result = {
			...searchDoc,
			...updatedSearchDoc,
		};

		return result;
	} catch (error) {
		console.error("Error in search beforeSync:", error);
		return {
			...searchDoc,
		};
	}
};

export const searchConfig = searchPlugin({
	collections: [SLUGS.serviceProviders], // Only sync service providers to search
	defaultPriorities: {
		[SLUGS.serviceProviders]: 10,
	},
	searchOverrides: {
		slug: "search",
		admin: {
			hidden: (req) => {
				return !isAdmin({ req }) && !isInfrastructure({ req });
			},
		},
		fields: (args) => {
			return [
				...args.defaultFields,
				{
					name: "searchableText",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "region",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "country",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "companySize",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "status",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "categories",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "subCategories",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "minimumBudget",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
				{
					name: "reviewsAverage",
					type: "text",
					index: true,
					admin: {
						readOnly: true,
					},
				},
			];
		},
	},
	beforeSync,
});
