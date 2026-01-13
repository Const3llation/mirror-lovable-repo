import { contactFormSchema } from "@/features/contact/schemas/contact-form-schema";
import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

// Define the response schema for successful contact form submission
const contactResponseSchema = z.object({
	success: z.boolean(),
	message: z.string(),
	id: z.string().optional(),
});

// Type for the response data
type ContactResponse = z.infer<typeof contactResponseSchema>;

/**
 * Submit contact form data to PayloadCMS
 */
const submitContactForm = async (
	formData: z.infer<typeof contactFormSchema>,
): Promise<ContactResponse> => {
	try {
		// Create a new contact submission in PayloadCMS
		const submission = await payload.create({
			collection: "contact-submissions", // This matches the slug in the ContactSubmission collection config
			data: {
				firstName: formData.firstName,
				lastName: formData.lastName,
				workEmail: formData.workEmail,
				subjectOfInquiry: formData.subjectOfInquiry,
				message: formData.message,
				// The privacyPolicy field will be handled by the beforeChange hook in the collection
				status: "new", // Default status for new submissions
			},
		});

		return {
			success: true,
			message: "Contact form submitted successfully",
			id: String(submission.id), // Convert id to string to match the schema
		};
	} catch (error) {
		console.error("Error submitting contact form:", error);
		throw error;
	}
};

// Export the POST handler using createApiRoute
export const POST = createApiRoute(
	{
		method: "POST",
		schema: contactFormSchema,
		responseDTO: contactResponseSchema,
		rateLimiter: true,
	},
	async (req, input) => {
		return await submitContactForm(input);
	},
);
