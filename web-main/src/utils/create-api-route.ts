import logger from "@/lib/logger";
import defaultRateLimiter from "@/lib/rate-limiter/limiters/default-rate-limiter";
import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

type RouteOptions<TInput, THandlerReturn, TOutput extends object> = {
	method: HttpMethod;
	schema?: z.Schema<TInput>;
	responseDTO: ((data: THandlerReturn) => TOutput) | z.Schema<TOutput>;
	rateLimiter?: boolean | RateLimiter;
	pathParamSchema?: z.Schema<Record<string, string>>;
};

type RouteHandler<TInput, THandlerReturn> = (
	req: NextRequest,
	input: TInput,
	pathParams: Record<string, string>,
) => Promise<THandlerReturn>;

export function createApiRoute<TInput, THandlerReturn, TOutput extends object>(
	options: RouteOptions<TInput, THandlerReturn, TOutput>,
	handler: RouteHandler<TInput, THandlerReturn>,
) {
	return async function routeHandler(
		req: NextRequest,
		{ params }: { params: Promise<Record<string, string>> },
	) {
		try {
			if (req.method !== options.method) {
				return NextResponse.json(
					{ error: "Method not allowed" },
					{ status: 405 },
				);
			}

			let validatedParams: Record<string, string>;
			if (options.pathParamSchema) {
				try {
					validatedParams = options.pathParamSchema.parse(await params);
				} catch (error) {
					if (error instanceof z.ZodError) {
						return NextResponse.json(
							{ error: "Invalid path parameters", details: error.errors },
							{ status: 400 },
						);
					}
					throw error;
				}
			} else {
				validatedParams = await params;
			}

			const rateLimiter =
				options.rateLimiter instanceof RateLimiter
					? options.rateLimiter
					: defaultRateLimiter;

			if (await rateLimiter.isRateLimited(req)) {
				return NextResponse.json(
					{ error: "Too many requests" },
					{
						status: 429,
					},
				);
			}

			let input: TInput;
			if (options.schema) {
				const data =
					req.method === "GET"
						? Object.fromEntries(req.nextUrl.searchParams)
						: await req.json();

				input = options.schema.parse(data);
			} else {
				input =
					req.method === "GET"
						? (Object.fromEntries(req.nextUrl.searchParams) as TInput)
						: await req.json();
			}

			const result = await handler(req, input, validatedParams);

			const response =
				typeof options.responseDTO === "function"
					? options.responseDTO(result)
					: options.responseDTO.safeParse(result);

			if ("success" in response) {
				if (!response.success) {
					logger.warn({
						msg: "Response validation error in API route",
						method: options.method,
						path: req.nextUrl.pathname,
						validation: response.error.errors,
					});

					return NextResponse.json(
						{
							error: "Invalid response format",
							details: response.error.errors,
						},
						{ status: 500 },
					);
				}

				return NextResponse.json(response.data);
			}

			return NextResponse.json(response);
		} catch (error) {
			if (error instanceof z.ZodError) {
				logger.warn({
					msg: "Validation error in API route",
					method: options.method,
					path: req.nextUrl.pathname,
					validation: error.errors,
				});

				return NextResponse.json(
					{ error: "Invalid input", details: error.errors },
					{ status: 400 },
				);
			}

			logger.error({
				msg: "API route error",
				method: options.method,
				path: req.nextUrl.pathname,
				err: error instanceof Error ? error : new Error(String(error)),
			});

			return NextResponse.json(
				{ error: "Internal server error" },
				{ status: 500 },
			);
		}
	};
}
