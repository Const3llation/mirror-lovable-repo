import logger from "@/lib/logger";
import { redis } from "@/lib/redis";
import { getIp } from "@/utils/get-ip";
import type { NextRequest } from "next/server";
export class RateLimiter {
	constructor(
		private readonly limit: number,
		private readonly windowInSeconds: number,
	) {}

	private getKey(identifier: string, path: string): string {
		return `ratelimit:${path}:${identifier}`;
	}

	async isRateLimited(req: NextRequest): Promise<boolean> {
		try {
			const identifier = (await getIp()) || "unknown";
			const path = req.nextUrl.pathname;
			const key = this.getKey(identifier, path);

			const now = Date.now();
			const windowMs = this.windowInSeconds * 1000;

			// Use Redis transaction for atomicity
			const multi = redis.multi();
			multi
				.zremrangebyscore(key, 0, now - windowMs) // Remove old entries
				.zadd(key, now, `${now}`) // Add current request
				.zcard(key) // Get count
				.pexpire(key, windowMs); // Set expiry

			const results = await multi.exec();
			const requestCount = (results?.[2]?.[1] as number) || 0;

			if (requestCount > this.limit) {
				logger.warn({
					msg: "Rate limit exceeded",
					path,
					identifier,
					requestCount,
					limit: this.limit,
				});
			}

			return requestCount > this.limit;
		} catch (error) {
			logger.error({
				err: error,
				msg: "Rate limiter error",
				path: req.nextUrl.pathname,
			});
			return false; // Allow request on error
		}
	}
}
