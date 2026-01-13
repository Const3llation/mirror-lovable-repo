import {
	isAdmin,
	isInfrastructure,
} from "@/features/auth/api/access/baseAccess";
import type { GlobalConfig } from "payload";

export const MainNavigation: GlobalConfig = {
	slug: "main-navigation",
	access: {
		read: () => true,
	},
	admin: {
		hidden: (req) => {
			return !isAdmin({ req }) && !isInfrastructure({ req });
		},
	},
	fields: [
		{
			name: "navItems",
			type: "array",
			maxRows: 12,
			fields: [
				{
					name: "title",
					type: "text",
					required: true,
				},
				{
					name: "page-slug",
					label: "Page Slug",
					type: "text",
					admin: {
						description: "The slug of the page to link to",
					},
				},
				{
					name: "is-categories",
					label: "Contains categories dropdown?",
					type: "radio",
					options: [
						{
							label: "Yes",
							value: "yes",
						},
						{
							label: "No",
							value: "no",
						},
					],
					defaultValue: "no",
					required: true,
					admin: {
						description: "Special menu that shows with list of all categories",
					},
				},
				{
					name: "categoryItems",
					type: "array",
					admin: {
						condition: (data, siblingData) =>
							siblingData["is-categories"] === "yes",
					},
					fields: [
						{
							name: "category",
							type: "relationship",
							relationTo: "categories",
							required: true,
						},
					],
				},
			],
		},
	],
};
