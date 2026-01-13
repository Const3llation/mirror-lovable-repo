import { revalidationHook } from "@/hooks/revalidation";
import {
	HTMLConverterFeature,
	lexicalEditor,
	lexicalHTML,
} from "@payloadcms/richtext-lexical";

export const BlogCategories = {
	slug: "blog-categories",

	admin: {
		group: "Blog",
		useAsTitle: "name",
	},

	labels: {
		plural: "Categories",
		singular: "Category",
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
			required: true,
			index: true,
		},
	],
	hooks: {
		afterChange: [revalidationHook],
	},
};

export const Blog = {
	slug: "blog",

	admin: {
		useAsTitle: "title",
		group: "Blog",
	},

	labels: {
		plural: "Posts",
		singular: "Post",
	},

	fields: [
		{
			name: "featuredImage",
			label: "Featured Image",
			type: "upload",
			required: false,
			relationTo: "image-uploads",
			filterOptions: {
				mimeType: { contains: "image/" },
			},
		},
		{
			name: "title",
			label: "Title",
			type: "text",
			required: true,
			index: true,
		},
		{
			name: "slug",
			label: "Slug",
			type: "text",
			required: true,
			index: true,
		},
		{
			name: "content",
			label: "Content",
			type: "richText",
			required: false,
			editor: lexicalEditor({
				lexical: {
					theme: {
						paragraph: "editor-paragraph",
					},
					namespace: "content",
				},
				features: ({ defaultFeatures }: any) => [
					...defaultFeatures,
					HTMLConverterFeature({}),
				],
			}),
		},
		{
			name: "categories",
			label: "Categories",
			type: "relationship",
			relationTo: "blog-categories",
			hasMany: false,
		},
		{
			name: "relatedPosts",
			label: "Related Posts",
			type: "relationship",
			relationTo: "blog",
			hasMany: true,
		},
		lexicalHTML("content", { name: "content_html" }),
	],
	hooks: {
		afterChange: [revalidationHook],
	},
};
