import {
	isAdmin,
	isInfrastructure,
} from "@/features/auth/api/access/baseAccess";
import type { GlobalConfig } from "payload";

export const Footer: GlobalConfig = {
	slug: "footer",
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
			maxRows: 3,
			fields: [
				{
					name: "title",
					type: "text",
					required: true,
				},
				{
					name: "slug",
					label: "Page slug",
					type: "text",
					required: true,
					admin: {
						description: "The slug of the page to link to",
					},
				},
				{
					name: "visible",
					label: "Visibility",
					type: "select",
					admin: {
						description:
							"Control visibility of the item in the footer without removing it",
					},
					defaultValue: "show",
					options: [
						{
							label: "Show",
							value: "show",
						},
						{
							label: "Hide",
							value: "hide",
						},
					],
				},
			],
		},
		{
			name: "socials",
			type: "array",
			maxRows: 5,
			fields: [
				{
					name: "icon",
					type: "text",
					required: true,
				},
				{
					name: "link",
					label: "link",
					type: "text",
					required: true,
				},
				{
					name: "visible",
					label: "Visibility",
					type: "select",
					admin: {
						description:
							"Control visibility of the item in the footer without removing it",
					},
					defaultValue: "show",
					options: [
						{
							label: "Show",
							value: "show",
						},
						{
							label: "Hide",
							value: "hide",
						},
					],
				},
			],
		},
	],
};
