import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const caseStudySearchSchema = z.object({
	slug: z.string().min(1),
	project_slug: z.string().min(1),
});

// Define the response schema based on your case study data structure
const caseStudyResponseSchema = z
	.object({
		caseStudySlug: z.string(),
		nextCaseStudy: z
			.object({
				caseStudySlug: z.string(),
			})
			.optional(),
	})
	.passthrough(); // Using passthrough() for other case study fields

export const GET = createApiRoute(
	{
		method: "GET",
		schema: caseStudySearchSchema,
		responseDTO: caseStudyResponseSchema,
		rateLimiter: true,
	},
	async (_req, input) => {
		const serviceProvider = await payload.find({
			collection: "service-providers",
			where: {
				slug: {
					equals: input.slug,
				},
			},
			depth: 2,
			limit: 1,
		});

		if (!serviceProvider.docs || serviceProvider.docs.length === 0) {
			throw new Error("Service provider not found");
		}

		const serviceProviderDoc = serviceProvider.docs[0];

		if (!serviceProviderDoc.caseStudies) {
			throw new Error("Case studies not found");
		}

		const caseStudy = serviceProviderDoc.caseStudies.find(
			(cs) => cs.caseStudySlug === input.project_slug,
		);

		if (!caseStudy) {
			throw new Error("Case study not found");
		}

		const caseStudyIndex = serviceProviderDoc.caseStudies.findIndex(
			(cs) => cs.caseStudySlug === input.project_slug,
		);

		const nextCaseStudy =
			serviceProviderDoc.caseStudies[
				(caseStudyIndex + 1) % serviceProviderDoc.caseStudies.length
			];

		return { ...caseStudy, nextCaseStudy };
	},
);
