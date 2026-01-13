import removeFileFromRemoteStorage from "@/features/file-uploads/services/remove-file-from-remote-storage";
import { revalidationHook } from "@/hooks/revalidation";
import type { CollectionConfig } from "payload";

export const FileUploads: CollectionConfig = {
	slug: "file-uploads",
	access: {
		read: () => true,
		create: () => true,
	},
	fields: [
		{
			name: "serviceProvider",
			type: "relationship",
			relationTo: "service-providers",
			admin: {
				description:
					"The service provider this file belongs to. Used during registration process for service provider.",
			},
		},
		{
			name: "description",
			type: "text",
			admin: {
				description: "Optional description of the file",
			},
		},
	],
	hooks: {
		afterChange: [revalidationHook],
	},
	upload: true,
};

export const ImageUploads: CollectionConfig = {
	slug: "image-uploads",
	access: {
		read: () => true,
		create: () => true,
	},
	fields: [
		{
			name: "serviceProvider",
			type: "relationship",
			relationTo: "service-providers",
			admin: {
				description: "The service provider this image belongs to",
			},
		},
		{
			name: "description",
			type: "text",
			admin: {
				description: "Optional description of the image",
			},
		},
	],
	hooks: {
		afterChange: [revalidationHook],
	},
	upload: true,
};

export const RemoteFileUploads: CollectionConfig = {
	slug: "remote-file-uploads",
	access: {
		read: () => true,
		create: () => true,
	},
	labels: {
		singular: "Cloudflare Upload",
		plural: "Cloudflare Uploads",
	},
	admin: {
		useAsTitle: "remoteURL",
		defaultColumns: ["type", "remoteURL", "serviceProvider"],
	},
	hooks: {
		afterChange: [revalidationHook],
		beforeRead: [
			async ({ doc }) => {
				if (doc.remoteURL.startsWith("https://img.shgstatic.com")) {
					return doc;
				}
				return {
					...doc,
					remoteURL: `https://storage.const3llation.com/${doc.remoteURL}`,
				};
			},
		],
		afterDelete: [
			async ({ doc }) => {
				await removeFileFromRemoteStorage(doc.remoteURL);
			},
			revalidationHook,
		],
	},
	fields: [
		{
			name: "type",
			type: "select",
			required: true,
			options: ["image", "document"],
			admin: {
				description: "Type of the remote file",
			},
		},
		{
			name: "serviceProvider",
			type: "relationship",
			relationTo: "service-providers",
			admin: {
				description: "The service provider this file is associated with",
			},
		},
		{
			name: "remoteURL",
			type: "text",
			required: true,
			admin: {
				description: "Remote file URL from our remote storage",
			},
			label: "Remote URL",
		},
		{
			name: "description",
			type: "text",
			admin: {
				description: "Optional description of the file",
			},
		},
	],
};
