import { transformFormToCMS } from "@/features/service-providers/utils/transformers";
import logger from "@/lib/logger";
import payload from "@/lib/payload";
import type { ServiceProvider } from "@/types/payload";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const createProviderSchema = z.object({
	id: z.union([z.number(), z.string()]).optional(),
	stepId: z.string(),
	data: z.array(z.record(z.any())),
	isLastStep: z.boolean(),
});

type CreateProviderRequest = z.infer<typeof createProviderSchema>;

type CreateProviderResponse = {
	serviceProviderId: string;
	stepId: string;
	isValid: boolean;
	data: ServiceProvider;
};

export const createServiceProvider = createApiRoute<
	CreateProviderRequest,
	CreateProviderResponse,
	CreateProviderResponse
>(
	{
		method: "POST",
		schema: createProviderSchema,
		responseDTO: z.object({
			serviceProviderId: z.number(),
			stepId: z.string(),
			isValid: z.boolean(),
			data: z.any(),
		}),
	},
	async (_req, input) => {
		logger.debug({
			msg: "Processing provider registration",
			stepId: input.stepId,
			serviceProviderId: input.id,
			isLastStep: input.isLastStep,
		});

		// Transform the data to match the expected format
		const formDataForTransform = {
			id: input.id,
			[input.stepId]: input.data,
			registrationProcessStatus: input.isLastStep ? "Completed" : "In Progress",
		};

		const transformedData = transformFormToCMS(formDataForTransform);

		// Case 1: Subsequent steps (we have serviceProviderId)
		if (input.id) {
			logger.debug({
				msg: "Updating existing provider",
				serviceProviderId: input.id,
				stepId: input.stepId,
			});

			const currentProvider = await payload.findByID({
				collection: "service-providers",
				id: input.id,
			});

			const mergedData = {
				...currentProvider,
				...transformedData,
			};

			const updatedProvider = await payload.update({
				collection: "service-providers",
				id: input.id,
				data: mergedData,
			});

			return {
				serviceProviderId: updatedProvider.id,
				stepId: input.stepId,
				isValid: true,
				data: updatedProvider,
			};
		}

		// Case 2: First step with email check
		if (transformedData.email) {
			logger.debug({
				msg: "Checking for existing provider",
				email: transformedData.email,
			});

			const existingProviders = await payload.find({
				collection: "service-providers",
				where: {
					and: [
						{ email: { equals: transformedData.email } },
						{ registrationProcessStatus: { equals: "In Progress" } },
					],
				},
				limit: 1,
			});

			const existingProvider = existingProviders.docs[0];

			if (existingProvider) {
				const mergedData = {
					...existingProvider,
					...transformedData,
				};

				const updatedProvider = await payload.update({
					collection: "service-providers",
					id: existingProvider.id,
					data: mergedData,
				});

				return {
					serviceProviderId: updatedProvider.id,
					stepId: input.stepId,
					isValid: true,
					data: updatedProvider,
				};
			}
		}

		// Case 3: First step, no existing provider
		logger.debug({
			msg: "Creating new provider",
			stepId: input.stepId,
		});

		const createdProvider = await payload.create({
			collection: "service-providers",
			data: transformedData,
		});

		logger.info({
			msg: "Provider created successfully",
			providerId: createdProvider.id,
			stepId: input.stepId,
		});

		return {
			serviceProviderId: createdProvider.id,
			stepId: input.stepId,
			isValid: true,
			data: createdProvider,
		};
	},
);
