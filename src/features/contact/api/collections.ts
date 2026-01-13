import type { CollectionConfig } from "payload";

export const ContactSubmission: CollectionConfig = {
	slug: "contact-submissions",
	admin: {
		useAsTitle: "workEmail",
		defaultColumns: [
			"firstName",
			"lastName",
			"workEmail",
			"subjectOfInquiry",
			"createdAt",
		],
	},
	labels: {
		singular: "Contact Submission",
		plural: "Contact Submissions",
	},
	fields: [
		{
			name: "firstName",
			type: "text",
			required: true,
			admin: {
				description: "First name of the contact",
			},
		},
		{
			name: "lastName",
			type: "text",
			required: true,
			admin: {
				description: "Last name of the contact",
			},
		},
		{
			name: "workEmail",
			type: "email",
			required: true,
			admin: {
				description: "Work email address of the contact",
			},
		},
		{
			name: "subjectOfInquiry",
			type: "text",
			required: true,
			admin: {
				description: "Subject of the inquiry",
			},
		},
		{
			name: "message",
			type: "textarea",
			required: true,
			admin: {
				description: "Message content",
			},
		},
		{
			name: "status",
			type: "select",
			defaultValue: "new",
			options: [
				{
					label: "New",
					value: "new",
				},
				{
					label: "In Progress",
					value: "in-progress",
				},
				{
					label: "Resolved",
					value: "resolved",
				},
				{
					label: "Archived",
					value: "archived",
				},
			],
			admin: {
				description: "Status of the contact submission",
			},
		},
		{
			name: "notes",
			type: "textarea",
			admin: {
				description: "Internal notes about this contact submission",
			},
		},
	],
	timestamps: true,
	access: {
		read: () => true,
		create: () => true,
		update: ({ req }) => req.user?.role === "admin",
		delete: ({ req }) => req.user?.role === "admin",
	},
	hooks: {
		beforeChange: [
			({ data }) => {
				return {
					...data,
					privacyPolicy: true,
				};
			},
		],
	},
};
