import type { CollectionConfig } from "payload";

export const HelpCenter: CollectionConfig = {
	slug: "help-center-items",
	admin: {
		useAsTitle: "title",
	},
	labels: {
		singular: "Help Center",
		plural: "Help Center",
	},
	fields: [
		{
			name: "title",
			type: "text",
			required: true,
		},
		{
			name: "content",
			type: "text",
			required: true,
		},
	],
};
