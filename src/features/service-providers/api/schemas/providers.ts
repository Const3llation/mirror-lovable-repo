import { z } from "zod";

// Search/Query schemas
export const providersSearch = z.object({
	email: z.string().nullable().optional(),
	slug: z.string().nullable().optional(),
	reviews: z.string().nullable().optional(),
	registrationProcessStatus: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	limit: z.string().nullable().optional(),
	depth: z.enum(["1", "2"]).nullable().optional(),
});

export type GetServiceProvidersRequest = z.infer<typeof providersSearch>;

// Response schemas
export const socialMediaLinks = z.object({
	linkedin: z.string().optional(),
	twitter: z.string().optional(),
	youtube: z.string().optional(),
	facebook: z.string().optional(),
	instagram: z.string().optional(),
	behance: z.string().optional(),
	github: z.string().optional(),
	customWeb: z.string().optional(),
});

export const address = z.object({
	addressType: z.enum(["Headquarters", "Branch"]),
	streetAddress1: z.string(),
	streetAddress2: z.string().optional(),
	city: z.string(),
	state: z.string(),
	postalCode: z.string(),
	country: z.string(),
});

export const caseStudy = z.object({
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

export const teamMember = z.object({
	firstName: z.string(),
	lastName: z.string(),
	position: z.string(),
	image: z.any(),
});

export const serviceProvider = z.object({
	providerName: z.string(),
	slug: z.string(),
	foundedYear: z.number().optional(),
	logo: z.any(),
	providerShortDescription: z.string().optional(),
	providerDescription: z.string().optional(),
	websiteUrl: z.string().optional(),
	socialMediaLinks: socialMediaLinks.optional(),
	addresses: z.array(address).optional(),
	caseStudies: z.array(caseStudy).optional(),
	companySize: z.string().optional(),
	teamMembers: z.array(teamMember).optional(),
	visibility: z.object({
		featured: z.enum(["Yes", "No"]),
		status: z.enum(["Verified", "Unverified"]),
	}),
	categories: z
		.object({
			categories: z.array(z.any()),
			subCategories: z.array(z.any()),
		})
		.optional(),
	findings: z
		.array(
			z.object({
				title: z.string(),
				text: z.string(),
			}),
		)
		.optional(),
	reviewsCount: z.number().optional(),
	reviewsAverage: z.number().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});
