import path from "node:path";
import { fileURLToPath } from "node:url";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { buildConfig } from "payload";
import sharp from "sharp";

import {
	FileUploads,
	ImageUploads,
	RemoteFileUploads,
} from "@/features/file-uploads/api/collections";
import { Pages } from "@/features/pages/api/collections";
import {
	ProviderContacts,
	ProviderReviews,
	ServiceProviders,
	VerifyProvidersEmail,
	VerifyProvidersForm,
} from "@/features/service-providers/api/collections";
import { Categories, SubCategories } from "@/features/services/api/collections";
import { Users } from "@/features/users/api/collections";

import { Footer } from "@/config/payload/globals/footer";
import { MainNavigation } from "@/config/payload/globals/main-navigation";
import { postgresConfig } from "@/config/payload/postgres";
import { searchConfig } from "@/config/payload/search";
import { s3StorageConfig } from "@/config/remote-storage";
import { TeamMembers } from "@/features/about/api/collections";
import { Blog, BlogCategories } from "@/features/blog/api/collections";
import { ContactSubmission } from "@/features/contact/api/collections";
import { HelpCenter } from "@/features/help-center/api/collections";
import { postmarkAdapter } from "@/lib/postmark";

const filename = fileURLToPath(import.meta.url);
const dirname = path.dirname(filename);

export default buildConfig({
	serverURL: process.env.PAYLOAD_URL || "",
	csrf: [process.env.PAYLOAD_URL || "", process.env.PAYLOAD_URL_PREFIX || ""],
	cors: {
		origins: [
			process.env.PAYLOAD_URL || "",
			process.env.PAYLOAD_URL_PREFIX || "",
		],
	},
	admin: {
		user: Users.slug,
		importMap: {
			baseDir: path.resolve(dirname),
		},
	},
	globals: [MainNavigation, Footer],
	collections: [
		ServiceProviders,
		Categories,
		SubCategories,
		TeamMembers,
		BlogCategories,
		Blog,
		VerifyProvidersForm,
		VerifyProvidersEmail,
		ProviderReviews,
		ProviderContacts,
		HelpCenter,
		Pages,
		Users,
		FileUploads,
		ImageUploads,
		RemoteFileUploads,
		ContactSubmission,
	],
	editor: lexicalEditor(),
	secret: process.env.PAYLOAD_SECRET || "",
	typescript: {
		outputFile: path.resolve("src/types/payload.ts"),
	},
	db: postgresConfig,
	email: postmarkAdapter({
		apiKey: process.env.POSTMARK_API_KEY || "",
		defaultFromAddress: "infra@const3llation.com",
		defaultFromName: "Kamron Yazdani",
		templates: {
			"admin-profile-verify-request": "39036222",
			"admin-provider-registration-success": "39035857",
			"admin-unverified-provider-contact-request": "39036369",

			"provider-verified-contact-request": "39036633",
			"provider-email-verification": "39033699",
			"provider-registration-welcome": "38600783",

			"client-provider-contact-received": "39036709",
		},
	}),
	sharp,
	plugins: [s3StorageConfig, searchConfig],
});
