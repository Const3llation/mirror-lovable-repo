import { z } from "zod";

export const contactFormSchema = z.object({
	firstName: z.string().trim().min(1, "First name is required."),
	lastName: z.string().trim().min(1, "Last name is required."),
	workEmail: z.string().email("Invalid work email address."),
	subjectOfInquiry: z.string().trim().min(1, "Subject of inquiry is required."),
	message: z.string().trim().min(1, "Message is required."),
	privacyPolicy: z.boolean().refine((value) => value === true, {
		message: "You must accept the privacy policy.",
	}),
});
