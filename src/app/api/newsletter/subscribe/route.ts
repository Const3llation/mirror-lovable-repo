import { subscribeToNewsletter } from "@/lib/klaviyo";
import logger from "@/lib/logger";
import { createApiRoute } from "@/utils/create-api-route";
import { z } from "zod";

const newsletterSchema = z.object({
	email: z.string().email("Invalid email address"),
});

export const POST = createApiRoute(
	{
		method: "POST",
		schema: newsletterSchema,
		responseDTO: z.any(),
	},
	async (_, input) => {
		try {
			logger.debug({ input }, "Newsletter subscription request received");

			const { email } = input;

			logger.info({ email }, "Newsletter subscription request received");

			await subscribeToNewsletter(
				email,
				process.env.KLAVIYO_WEB_LIST_ID as string,
			);

			logger.info({ email }, "Successfully subscribed to newsletter");
			return { message: "Successfully subscribed to newsletter" };
		} catch (error) {
			if (error instanceof SyntaxError) {
				logger.warn({ error }, "Invalid JSON in request body");
				return { error: "Invalid request format" };
			}

			if (error instanceof z.ZodError) {
				logger.warn(
					{ error },
					"Invalid email address for newsletter subscription",
				);
				return { error: "Invalid email address" };
			}

			logger.error({ error }, "Failed to subscribe to newsletter");
			return { error: "Failed to subscribe to newsletter" };
		}
	},
);
