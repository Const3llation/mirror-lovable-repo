import { z } from "zod";

const multipleFileUploadField = z
	.union([
		z.custom<File[]>(
			(val) => Array.isArray(val) && val.every((item) => item instanceof File),
		),
		z.string(),
		z.null(),
	])
	.optional()
	.nullable();

const basicInformationSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required"),
	lastName: z.string().trim().min(1, "Last name is required"),
	email: z.string().email("Invalid email address").toLowerCase(),
	telegramUsername: z
		.string()
		.regex(/^@?[a-zA-Z0-9_]{5,32}$/, "Invalid Telegram username")
		.transform((val) => (val.startsWith("@") ? val : `@${val}`)),
});

const projectSchema = z.object({
	description: z.string().trim().min(1, "Project description is required"),
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
	services: z
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
				type: z.enum(["category", "sub-category"]),
			}),
		)
		.min(1, "At least one service is required"),
	additionalDetails: z
		.string()
		.trim()
		.min(1, "Additional details are required"),
	files: multipleFileUploadField,
});

const cashbackSchema = z.object({
	crypto: z.object({
		id: z.string().min(1, "Crypto is required"),
		label: z.string().min(1, "Crypto is required"),
		value: z.string().min(1, "Crypto is required"),
	}),
	walletAddress: z.string().min(1, "Wallet address is required"),
	acceptPrivacyPolicy: z.boolean().refine((value) => value === true, {
		message: "You must accept the privacy policy.",
	}),
});

export const serviceProvidersContactFormSchema = z.object({
	basicInformation: basicInformationSchema,
	project: projectSchema,
	cashback: cashbackSchema,
});
