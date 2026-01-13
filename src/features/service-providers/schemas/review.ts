import { z } from "zod";

const singleFileUploadField = z
	.union([
		z.custom<File>((val) => val instanceof File),
		z.string(), // For existing image URLs/paths
		z.null(),
	])
	.optional()
	.nullable();

const basicInformationSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required"),
	lastName: z.string().trim().min(1, "Last name is required"),
	email: z.string().email("Invalid email address").toLowerCase(),
	phoneNumber: z.string().min(5, "Phone number is required"),
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
	file: singleFileUploadField.optional(),
	proofOfPaymentUrl: z.string().trim().optional(),
});

const reviewSchema = z.object({
	rating: z
		.number()
		.min(1, "Rating is required")
		.max(5, "Rating must be between 1 and 5 stars."),
	review: z.string().trim().min(1, "Review is required"),
});

const cashbackSchema = z.object({
	crypto: z
		.object({
			id: z.string().min(1, "Crypto is required"),
			label: z.string().min(1, "Crypto is required"),
			value: z.string().min(1, "Crypto is required"),
		})
		.nullable()
		.refine((val) => val !== null, {
			message: "Please select a cryptocurrency",
		}),
	walletAddress: z.string().min(1, "Wallet address is required"),
	acceptPrivacyPolicy: z.boolean().refine((value) => value === true, {
		message: "You must accept the privacy policy.",
	}),
});

export const serviceProvidersReviewFormSchema = z.object({
	basicInformation: basicInformationSchema,
	project: projectSchema,
	review: reviewSchema,
	cashback: cashbackSchema,
});
