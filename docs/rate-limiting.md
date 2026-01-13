# 🛡️ Rate Limiting System

The CONST3LLATION platform implements a **Redis-based rate limiting system** designed to protect API endpoints from abuse, prevent brute force attacks, and ensure fair resource usage across all users.

## 🏗️ Architecture Overview

```
Client Request          Next.js API              Redis Cache
     │                       │                        │
     │── API Request ────────▶│                        │
     │                       │── Check Rate Limit ───▶│
     │                       │◄─ Current Count ───────│
     │                       │                        │
     │◄─ 429 Rate Limited ───│ (if exceeded)          │
     │      OR               │                        │
     │◄─ Process Request ────│ (if within limit)      │
```

## 🔄 Rate Limiting Flow

### 1. **Request Processing**
- Extract client identifier (IP address)
- Generate unique key: `ratelimit:{path}:{identifier}`
- Check current request count in Redis
- Allow or deny request based on configured limits

### 2. **Sliding Window Algorithm**
- Uses Redis sorted sets for precise time-based tracking
- Removes expired entries automatically
- Maintains accurate count within the time window
- Atomic operations prevent race conditions

### 3. **Error Handling**
- Graceful degradation on Redis failures
- Detailed logging for monitoring
- Falls back to allowing requests on system errors

## 🎯 Available Rate Limiters

### **1. Default Rate Limiter**
```typescript
// 60 requests per minute (1 req/sec average)
export default new RateLimiter(60, 60);
```
**Usage**: General API endpoints, content retrieval

### **2. Authentication Rate Limiter**
```typescript
// 5 attempts per minute
export default new RateLimiter(5, 60);
```
**Usage**: Login attempts, password resets, sensitive operations

### **3. Provider Registration Limiter**
```typescript
// 3 registration attempts per hour
export default new RateLimiter(3, 3600);
```
**Usage**: Service provider registration to prevent spam

### **4. File Upload Limiter**
```typescript
// 50 uploads per minute
export default new RateLimiter(50, 60);
```
**Usage**: File upload endpoints due to resource intensity

## 🔧 Implementation Details

### **Core Rate Limiter Class**
```typescript
export class RateLimiter {
  constructor(
    private readonly limit: number,        // Max requests allowed
    private readonly windowInSeconds: number, // Time window
  ) {}

  async isRateLimited(req: NextRequest): Promise<boolean> {
    const identifier = await getIp() || "unknown";
    const path = req.nextUrl.pathname;
    const key = `ratelimit:${path}:${identifier}`;

    // Redis sliding window implementation
    const multi = redis.multi();
    multi
      .zremrangebyscore(key, 0, now - windowMs) // Remove old entries
      .zadd(key, now, `${now}`)                // Add current request
      .zcard(key)                              // Get count
      .pexpire(key, windowMs);                 // Set expiry

    const results = await multi.exec();
    const requestCount = results?.[2]?.[1] as number || 0;

    return requestCount > this.limit;
  }
}
```

### **Key Generation Strategy**
```typescript
// Format: ratelimit:{path}:{identifier}
"ratelimit:/api/auth/login:192.168.1.100"
"ratelimit:/api/uploads:user-session-id"
"ratelimit:/api/providers/register:10.0.0.1"
```

## 🚀 API Integration

### **Using createApiRoute Utility**
```typescript
import { createApiRoute } from "@/utils/create-api-route";
import authRateLimiter from "@/lib/rate-limiter/limiters/auth-rate-limiter";

export const POST = createApiRoute(
  {
    method: "POST",
    schema: loginSchema,
    responseDTO: loginResponseSchema,
    rateLimiter: authRateLimiter, // Custom rate limiter
  },
  async (req, input) => {
    // Handler logic
    return await authenticateUser(input);
  }
);
```

### **Default Rate Limiting**
```typescript
// Using boolean enables default rate limiter
export const GET = createApiRoute(
  {
    method: "GET",
    schema: searchSchema,
    responseDTO: searchResponseSchema,
    rateLimiter: true, // Uses default rate limiter
  },
  handler
);
```

### **Manual Integration**
```typescript
import uploadFilesLimiter from "@/lib/rate-limiter/limiters/upload-files-limiter";

export async function POST(request: NextRequest) {
  // Check rate limit first
  const isLimited = await uploadFilesLimiter.isRateLimited(request);
  if (isLimited) {
    return NextResponse.json(
      { error: "Too many upload requests. Please try again later." },
      { status: 429 }
    );
  }

  // Process request
  // ...
}
```

## 📊 Rate Limit Configuration

### **Environment Variables**
```bash
# Redis Configuration (required for rate limiting)
REDIS_URL=redis://localhost:6379
REDISHOST=localhost
REDISPORT=6379
REDISPASSWORD=your-redis-password
```

### **Custom Rate Limiters**
```typescript
import { RateLimiter } from "@/lib/rate-limiter/rate-limiter";

// Custom rate limiter for specific endpoints
export const customLimiter = new RateLimiter(
  100,    // 100 requests
  3600    // per hour (3600 seconds)
);

// Burst limiter for real-time features
export const burstLimiter = new RateLimiter(
  10,     // 10 requests  
  1       // per second
);
```

## 🛡️ Security Features

### **IP-Based Tracking**
- Automatic IP address extraction
- Support for proxy headers (X-Forwarded-For)
- Handles IPv4 and IPv6 addresses
- Fallback to "unknown" for edge cases

### **Path-Specific Limits**
- Different limits for different endpoints
- Granular control over resource access
- Prevents endpoint-specific abuse

### **Atomic Operations**
```typescript
// Redis transaction ensures data consistency
const multi = redis.multi();
multi
  .zremrangebyscore(key, 0, now - windowMs) // Cleanup
  .zadd(key, now, `${now}`)                 // Add request
  .zcard(key)                               // Count
  .pexpire(key, windowMs);                  // Expire

const results = await multi.exec(); // Atomic execution
```

### **Error Resilience**
```typescript
catch (error) {
  logger.error({ err: error, msg: "Rate limiter error", path });
  return false; // Allow request on Redis failure
}
```

## 📈 Monitoring & Observability

### **Logging**
```typescript
// Rate limit exceeded
logger.warn({
  msg: "Rate limit exceeded",
  path: "/api/auth/login",
  identifier: "192.168.1.100", 
  requestCount: 6,
  limit: 5
});

// System errors
logger.error({
  err: error,
  msg: "Rate limiter error", 
  path: req.nextUrl.pathname
});
```

### **Metrics Tracking**
- Request counts per endpoint
- Rate limit violations
- Redis connection health
- Response time impact

## 🚨 Error Responses

### **Rate Limit Exceeded (429)**
```json
{
  "error": "Too many requests"
}
```

### **Custom Error Messages**
```json
{
  "error": "Too many upload requests. Please try again later."
}
```

## 🔧 Advanced Configuration

### **Custom Identifier Extraction**
```typescript
class CustomRateLimiter extends RateLimiter {
  private async getIdentifier(req: NextRequest): Promise<string> {
    // Custom logic: use user ID if authenticated, fallback to IP
    const userId = await getUserId(req);
    return userId || await getIp() || "anonymous";
  }
}
```

### **Dynamic Rate Limits**
```typescript
class AdaptiveRateLimiter extends RateLimiter {
  async isRateLimited(req: NextRequest): Promise<boolean> {
    // Adjust limits based on user tier, time of day, etc.
    const userTier = await getUserTier(req);
    const dynamicLimit = this.limit * (userTier === 'premium' ? 2 : 1);
    
    // Custom implementation with dynamic limits
    // ...
  }
}
```

### **Distributed Rate Limiting**
```typescript
// For multi-instance deployments
const RATE_LIMIT_KEY_PREFIX = `${process.env.INSTANCE_ID}:ratelimit:`;

private getKey(identifier: string, path: string): string {
  return `${RATE_LIMIT_KEY_PREFIX}${path}:${identifier}`;
}
```

## 🔍 Debugging & Troubleshooting

### **Common Issues**
1. **Redis Connection Failures**: Check Redis server status and connectivity
2. **High Memory Usage**: Monitor Redis memory, implement key expiration
3. **False Positives**: Verify IP extraction logic, check proxy configuration

### **Debug Tools**
```typescript
// Check current rate limit status
const debugRateLimit = async (identifier: string, path: string) => {
  const key = `ratelimit:${path}:${identifier}`;
  const count = await redis.zcard(key);
  const ttl = await redis.ttl(key);
  
  console.log(`Rate limit for ${key}: ${count} requests, TTL: ${ttl}s`);
};
```

### **Testing Rate Limits**
```typescript
// Test rate limiter behavior
describe('Rate Limiter', () => {
  test('should allow requests within limit', async () => {
    const limiter = new RateLimiter(5, 60);
    // Test implementation
  });

  test('should block requests exceeding limit', async () => {
    // Test rate limit enforcement
  });
});
```

## 📚 Related Documentation

- [Redis Configuration](../README.md#environment-variables)
- [API Route Creation](./api-routes.md)
- [Monitoring & Logging](./monitoring.md)
- [Security Best Practices](./security.md)

---

This comprehensive rate limiting system ensures the CONST3LLATION platform remains secure, performant, and fair for all users while protecting against various types of abuse and ensuring optimal resource utilization. 