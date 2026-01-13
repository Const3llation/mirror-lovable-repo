import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";

// Very restrictive for provider registration to prevent abuse
// 3 registration attempts per hour
export default new RateLimiter(3, 3600);
