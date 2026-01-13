import { createUrlSchema } from "@/utils/validators";
import { z } from "node_modules/zod/lib";

const multipleFileUploadField = z
	.union([
		z.custom<File[]>(
			(val) => Array.isArray(val) && val.every((item) => item instanceof File),
		),
		z.string(), // For existing image URLs/paths
		z.null(),
	])
	.optional()
	.nullable();

const basicInformationSchema = z.object({
	providerName: z.string().trim().min(1, "Provider name is required"),
	foundedYear: z.coerce
		.number()
		.min(1800, "Founded year must be after 1800")
		.max(new Date().getFullYear(), "Founded year cannot be in the future"),

	email: z.string().email("Invalid email address").toLowerCase(),
	phoneNumber: z.string().min(1, "Phone number is required"),
	telegramUsername: z
		.string()
		.regex(/^@?[a-zA-Z0-9_]{5,32}$/, "Invalid Telegram username")
		.transform((val) => (val.startsWith("@") ? val : `@${val}`)),
	websiteUrl: createUrlSchema("website URL"),
	country: z.string().min(2, "Country is required"),
	state: z.string().min(1, "State is required").optional(),
	city: z.string().min(1, "City is required"),
	streetAddress: z.string().min(1, "Street address is required"),
	postalCode: z
		.string()
		.regex(/^[A-Z0-9-\s]{3,10}$/i, "Invalid postal code format"),
});

const brandingSchema = z.object({
	logo: z.custom<File>((val) => val instanceof File, "Logo is required"),
	shortDescription: z
		.string()
		.min(1, "Short description is required")
		.max(300, "Short description must be less than 300 characters"),
	longDescription: z
		.string()
		.min(1, "Long description is required")
		.max(600, "Long description must be less than 600 characters"),
});

const categoriesSchema = z.object({
	categories: z.array(z.string()).min(1, "At least one category is required"),
	subCategories: z
		.array(z.string())
		.min(1, "At least one sub-category is required"),
});

const portfolioSchema = z.object({
	minimumBudget: z.object({
		id: z.string().min(1, "Minimum budget is required"),
		label: z.string().min(1, "Minimum budget is required"),
		value: z.string().min(1, "Minimum budget is required"),
	}),
	caseStudies: z
		.array(
			z.object({
				clientName: z.string().min(1, "Client name is required"),
				title: z.string().min(1, "Project name is required"),
				description: z.string().min(1, "Project description is required"),
				projectUrl: createUrlSchema("Project URL"),
				serviceCategories: z
					.array(
						z.object({
							id: z.union([
								z.string().min(1, "Service is required"),
								z.number().min(1, "Service is required"),
							]),
							label: z.string().min(1, "Service is required"),
							value: z.union([
								z.string().min(1, "Service is required"),
								z.number().min(1, "Service is required"),
							]),
						}),
					)
					.min(1, "At least one service is required"),
				achievedMetrics: z.array(
					z
						.string()
						.min(10, "Metric must be at least 10 characters")
						.max(600, "Metric must be less than 600 characters"),
				),
				files: multipleFileUploadField,
				budget: z.object({
					id: z.string().min(1, "Minimum budget is required"),
					label: z.string().min(1, "Minimum budget is required"),
					value: z.string().min(1, "Minimum budget is required"),
				}),
				timeline: z.object({
					id: z.string().min(1, "Timeline is required"),
					label: z.string().min(1, "Timeline is required"),
					value: z.string().min(1, "Timeline is required"),
				}),
			}),
		)
		.min(1, "At least one case study is required"),
});

const teamSchema = z.object({
	companySize: z.object({
		id: z.string().min(1, "Company size is required"),
		label: z.string().min(1, "Company size is required"),
		value: z.string().min(1, "Company size is required"),
	}),
	teamMembers: z.array(
		z.object({
			firstName: z.string().min(1, "First name is required"),
			lastName: z.string().min(1, "Last name is required"),
			position: z.string().min(1, "Position is required"),
			image: z.custom<File>((val) => val instanceof File, "Image is required"),
		}),
	),
});

const createSocialMediaFieldSchema = () => z.string().optional();

const socialMediaSchema = z
	.object({
		linkedIn: createSocialMediaFieldSchema(),
		additionalWebsite: createSocialMediaFieldSchema(),
		x: createSocialMediaFieldSchema(),
		youtube: createSocialMediaFieldSchema(),
		facebook: createSocialMediaFieldSchema(),
		instagram: createSocialMediaFieldSchema(),
		behance: createSocialMediaFieldSchema(),
		github: createSocialMediaFieldSchema(),
		tiktok: createSocialMediaFieldSchema(),
	})
	.refine(
		(data) => {
			return Object.values(data).some((value) => value && value.length > 0);
		},
		{
			message: "At least one social media profile is required",
			path: [],
		},
	);

export const serviceProviderFormSchema = z.object({
	basicInformation: basicInformationSchema,
	branding: brandingSchema,
	services: categoriesSchema,
	portfolio: portfolioSchema,
	socialMedia: socialMediaSchema,
	team: teamSchema,
});
