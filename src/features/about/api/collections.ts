import type { CollectionConfig } from "payload";

export const TeamMembers: CollectionConfig = {
	slug: "team-members",
	admin: {
		group: "Team Members",
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
			label: "Name",
		},
		{
			name: "position",
			type: "text",
			required: true,
			label: "Position",
		},
		{
			name: "image",
			type: "upload",
			required: false,
			label: "Image",
			relationTo: "image-uploads",
		},
	],
};
