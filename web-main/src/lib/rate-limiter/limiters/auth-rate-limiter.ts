import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";

// Stricter limits for authentication endpoints to prevent brute force attacks
// 5 attempts per minute
export default new RateLimiter(5, 60);
