import {
	isAdmin,
	isInfrastructure,
} from "@/features/auth/api/access/baseAccess";
import { revalidationHook } from "@/hooks/revalidation";
import stringToSlug from "@/utils/string-to-slug";
import {
	HTMLConverterFeature,
	lexicalEditor,
} from "@payloadcms/richtext-lexical";
import type { CollectionConfig } from "payload";

export const Categories: CollectionConfig = {
	slug: "categories",
	access: {
		read: (req) => isAdmin(req) || isInfrastructure(req),
		create: (req) => isAdmin(req) || isInfrastructure(req),
		update: (req) => isAdmin(req) || isInfrastructure(req),
		delete: (req) => isAdmin(req) || isInfrastructure(req),
	},
	admin: {
		group: "Categories",
		useAsTitle: "name",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			index: true,
		},
		{
			name: "slug",
			type: "text",
			admin: {
				readOnly: true,
				description:
					"URL friendly version of a name used to identify a category",
			},
			hooks: {
				beforeChange: [
					({ siblingData }) => {
						if (siblingData.name) {
							return stringToSlug(siblingData.name);
						}
						return undefined;
					},
				],
			},
		},
		{
			name: "icon",
			type: "text",
			required: true,
			admin: {
				description: "When a category is displayed, this icon will be used",
			},
		},
		{
			name: "subCategories",
			type: "relationship",
			relationTo: "sub-categories",
			hasMany: true,
		},
		{
			name: "description",
			label: "Description",
			type: "richText",
			required: false,
			admin: {
				description: "A short description of the category",
			},
			editor: lexicalEditor({
				lexical: {
					theme: {
						paragraph: "editor-paragraph",
					},
					namespace: "content",
				},
				features: ({ defaultFeatures }) => [
					...defaultFeatures,
					HTMLConverterFeature({}),
				],
			}),
		},
	],
	hooks: {
		afterChange: [revalidationHook],
	},
};

export const SubCategories: CollectionConfig = {
	slug: "sub-categories",
	access: {
		read: () => true,
		create: (req) => isAdmin(req) || isInfrastructure(req),
		update: (req) => isAdmin(req) || isInfrastructure(req),
		delete: (req) => isAdmin(req) || isInfrastructure(req),
	},
	admin: {
		group: "Categories",
		useAsTitle: "name",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			index: true,
		},
		{
			name: "slug",
			type: "text",
			admin: {
				readOnly: true,
				description:
					"URL friendly version of a name used to identify a category",
			},
			hooks: {
				beforeChange: [
					({ siblingData }) => {
						if (siblingData.name) {
							return stringToSlug(siblingData.name);
						}
						return undefined;
					},
				],
			},
		},
		{
			name: "parentCategory",
			type: "relationship",
			relationTo: "categories",
			hasMany: false,
			required: true,
		},
	],
	hooks: {
		afterChange: [revalidationHook],
	},
};
