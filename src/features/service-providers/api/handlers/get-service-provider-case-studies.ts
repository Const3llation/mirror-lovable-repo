import logger from "@/lib/logger";
import payload from "@/lib/payload";
import type { ServiceProvider } from "@/types/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const getCaseStudiesSchema = z.object({
	id: z.string(),
});

const caseStudySchema = z.object({
	clientName: z.string(),
	title: z.string(),
	timeline: z.string(),
	caseStudySlug: z.string(),
	description: z.string(),
	projectUrl: z.string().optional(),
	files: z.array(z.any()),
	images: z.array(z.any()),
	serviceCategories: z.object({
		categories: z.array(z.any()),
		subCategories: z.array(z.any()),
	}),
	achievedMetrics: z.array(
		z.object({
			metric: z.string(),
		}),
	),
});

type GetCaseStudiesRequest = z.infer<typeof getCaseStudiesSchema>;
type CaseStudy = z.infer<typeof caseStudySchema>;

type CaseStudiesResponse = {
	caseStudies: CaseStudy[];
};

const transformCaseStudies = (provider: ServiceProvider): CaseStudy[] => {
	return (provider.caseStudies || []).map((study) => ({
		clientName: study.clientName || "",
		title: study.title || "",
		timeline: study.timeline || "",
		caseStudySlug: study.caseStudySlug || "",
		description: study.description || "",
		projectUrl: study.projectUrl,
		files: study.files || [],
		images: study.images || [],
		serviceCategories: {
			categories: study.serviceCategories?.categories || [],
			subCategories: study.serviceCategories?.subCategories || [],
		},
		achievedMetrics: (study.achievedMetrics || []).map((metric) => ({
			metric: metric.metric || "",
		})),
	}));
};

export const getServiceProviderCaseStudies = createApiRoute<
	GetCaseStudiesRequest,
	ServiceProvider | null,
	CaseStudiesResponse
>(
	{
		method: "GET",
		schema: getCaseStudiesSchema,
		responseDTO: (data: ServiceProvider | null): CaseStudiesResponse => ({
			caseStudies: data ? transformCaseStudies(data) : [],
		}),
	},
	async (req, { id }) => {
		logger.debug({ msg: "Fetching service provider case studies", id });

		const provider = await payload.findByID({
			collection: "service-providers",
			id,
			depth: 2,
		});

		if (!provider) {
			throw new Error(`Service provider not found: ${id}`);
		}

		return provider;
	},
);
