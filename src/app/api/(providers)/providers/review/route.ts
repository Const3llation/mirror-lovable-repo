import { serviceProvidersReviewFormSchema } from "@/features/service-providers/schemas/review";
import { transformReviewFormToCMS } from "@/features/service-providers/utils/transformers";
import payload from "@/lib/payload";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

// Extend the review schema to include serviceProviderSlug
const reviewApiSchema = serviceProvidersReviewFormSchema.extend({
	serviceProviderSlug: z.string(),
});

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();

		// Validate the incoming request data
		const validationResult = reviewApiSchema.safeParse(body);

		if (!validationResult.success) {
			return NextResponse.json(
				{
					error: "Invalid request data",
					details: validationResult.error.errors,
				},
				{ status: 400 },
			);
		}

		// Find the service provider first
		const provider = await payload.find({
			collection: "service-providers",
			where: {
				slug: {
					equals: validationResult.data.serviceProviderSlug,
				},
			},
		});

		if (!provider.docs.length) {
			return NextResponse.json(
				{ error: "Service provider not found" },
				{ status: 404 },
			);
		}

		// Transform the data
		const transformedData = transformReviewFormToCMS(validationResult.data);

		// Create the review
		const review = await payload.create({
			collection: "provider-reviews",
			data: {
				...transformedData,
				serviceProvider: provider.docs[0].id,
			},
		});

		return NextResponse.json({
			success: true,
			id: review.id,
		});
	} catch (error) {
		console.error("Failed to create review:", error);
		return NextResponse.json(
			{ error: "Failed to create review" },
			{ status: 500 },
		);
	}
}
