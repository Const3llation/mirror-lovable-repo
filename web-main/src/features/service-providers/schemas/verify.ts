import { z } from "zod";

export const verifyProviderSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required."),
	lastName: z.string().trim().min(1, "Last name is required."),
	workEmail: z.string().email("Invalid work email address."),
	jobPosition: z.string().trim().min(1, "Job position is required."),
	note: z.string().trim().min(1, "Note is required."),
	privacyPolicy: z.boolean().refine((value) => value === true, {
		message: "You must accept the privacy policy.",
	}),
});
