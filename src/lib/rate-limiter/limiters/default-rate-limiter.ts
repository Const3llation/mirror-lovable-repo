import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";

// Default rate limiter: 60 requests per minute (1 req/sec on average)
export default new RateLimiter(60, 60);
