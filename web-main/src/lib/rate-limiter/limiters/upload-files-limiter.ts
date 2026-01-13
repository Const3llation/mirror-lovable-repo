import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";

// More restrictive for file uploads due to resource intensity
// 50 uploads per minute
export default new RateLimiter(50, 60);
