import { Redis } from "ioredis";

export const redis = new Redis({
	host: process.env.REDISHOST || "localhost",
	port: Number.parseInt(process.env.REDISPORT || "6379"),
	password: process.env.REDISPASSWORD,
	...(process.env.NODE_ENV === "development"
		? {}
		: {
				family: 0,
			}),
});

export const REDIS_PREFIXES = {
	RATE_LIMIT: "ratelimit:",
	CACHE: "cache:",
} as const;
