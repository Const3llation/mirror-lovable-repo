import logger from "@/lib/logger";
import payload from "@/lib/payload";
import { createApiRoute } from "@/utils/create-api-route";
import type { PaginatedDocs } from "payload";
import { z } from "zod";

const getReviewsSchema = z.object({
	id: z.string(),
	limit: z.number().min(0).max(150).optional(),
	page: z.number().min(1).optional(),
});

const reviewSchema = z.object({
	firstName: z.string(),
	lastName: z.string(),
	review: z.object({
		rating: z.number(),
		review: z.string(),
	}),
	project: z.object({
		description: z.string(),
		services: z.array(z.any()),
		timeline: z.string(),
	}),
	createdAt: z.string(),
});

type GetReviewsRequest = z.infer<typeof getReviewsSchema>;
type Review = z.infer<typeof reviewSchema>;
type ProviderReview = {
	firstName: string;
	lastName: string;
	review: {
		rating: number;
		review: string;
	};
	project: {
		description: string;
		services: unknown[];
		timeline: string;
	};
	createdAt: string;
};

type ReviewsResponse = {
	reviews: ProviderReview[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
};

export const getServiceProviderReviews = createApiRoute<
	GetReviewsRequest,
	PaginatedDocs<ProviderReview>,
	ReviewsResponse
>(
	{
		method: "GET",
		schema: getReviewsSchema,
		responseDTO: (data: PaginatedDocs<ProviderReview>): ReviewsResponse => ({
			reviews: data.docs.map((review) => ({
				firstName: review.firstName,
				lastName: review.lastName,
				review: {
					rating: review.review.rating,
					review: review.review.review,
				},
				project: {
					description: review.project.description,
					services: review.project.services,
					timeline: review.project.timeline,
				},
				createdAt: review.createdAt,
			})),
			totalDocs: data.totalDocs,
			limit: data.limit,
			totalPages: data.totalPages,
			page: data.page,
			hasNextPage: data.hasNextPage,
			hasPrevPage: data.hasPrevPage,
		}),
	},
	async (req, { id, limit = 10, page = 1 }) => {
		logger.debug({ msg: "Fetching service provider reviews", id, limit, page });

		const reviews = await payload.find({
			collection: "provider-reviews",
			where: {
				serviceProvider: { equals: id },
			},
			limit,
			page,
			depth: 1,
		});

		return reviews as PaginatedDocs<ProviderReview>;
	},
);
