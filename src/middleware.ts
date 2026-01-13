// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Simple in-memory store for rate limiting
// In production, use Redis or similar for distributed systems
const rateLimit = new Map<string, { count: number; timestamp: number }>();

// Rate limit settings
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_ATTEMPTS = 5; // Maximum attempts per window

const getRateLimitInfo = (ip: string) => {
	const now = Date.now();
	const rateLimitInfo = rateLimit.get(ip);

	// Clean up old entries
	if (rateLimitInfo && now - rateLimitInfo.timestamp > RATE_LIMIT_WINDOW) {
		rateLimit.delete(ip);
		return { count: 0, timestamp: now };
	}

	return rateLimitInfo || { count: 0, timestamp: now };
};

const basicAuthCheck = (req: NextRequest) => {
	const basicAuth = req.headers.get("authorization");
	const ip = req.ip || "unknown";

	// Check rate limit
	const rateLimitInfo = getRateLimitInfo(ip);
	if (rateLimitInfo.count >= MAX_ATTEMPTS) {
		const timeLeft = Math.ceil(
			(RATE_LIMIT_WINDOW - (Date.now() - rateLimitInfo.timestamp)) / 1000 / 60,
		);
		throw new Error(
			`Too many attempts. Please try again in ${timeLeft} minutes.`,
		);
	}

	if (basicAuth) {
		const authValue = basicAuth.split(" ")[1];
		const [user, pwd] = atob(authValue).split(":");

		const BASIC_AUTH_USER = process.env.BASIC_AUTH_USER;
		const BASIC_AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

		if (user === BASIC_AUTH_USER && pwd === BASIC_AUTH_PASSWORD) {
			// Reset rate limit on successful auth
			rateLimit.delete(ip);
			return true;
		}
	}

	// Increment attempt count
	rateLimit.set(ip, {
		count: rateLimitInfo.count + 1,
		timestamp: rateLimitInfo.timestamp,
	});

	return false;
};

export function middleware(req: NextRequest) {
	// Enforce HTTPS
	if (!req.url.startsWith("https") && process.env.NODE_ENV === "production") {
		return NextResponse.redirect(
			`https://${req.headers.get("host")}${req.nextUrl.pathname}`,
		);
	}

	// More descriptive name
	const isProductionEnvironment = process.env.NODE_ENV === "production";

	// Skip auth for specific paths
	if (
		req.nextUrl.pathname.startsWith("/_next") ||
		req.nextUrl.pathname.startsWith("/api") ||
		req.nextUrl.pathname.startsWith("/static") ||
		req.nextUrl.pathname.startsWith("/favicon.ico")
	) {
		return NextResponse.next();
	}

	// Only apply basic auth in protected environments
	if (isProductionEnvironment) {
		try {
			const isAuthenticated = basicAuthCheck(req);

			if (!isAuthenticated) {
				return new NextResponse("Authentication required", {
					status: 401,
					headers: {
						"WWW-Authenticate": 'Basic realm="Secure Area"',
						// Add security headers
						"Strict-Transport-Security": "max-age=31536000; includeSubDomains",
						"X-Frame-Options": "DENY",
						"X-Content-Type-Options": "nosniff",
					},
				});
			}
		} catch (error) {
			// Handle rate limit errors
			return new NextResponse(
				error instanceof Error ? error.message : "Too many attempts",
				{
					status: 429,
					headers: {
						"Retry-After": "900", // 15 minutes in seconds
					},
				},
			);
		}
	}

	const response = NextResponse.next();

	// Add security headers to all responses
	response.headers.set(
		"Strict-Transport-Security",
		"max-age=31536000; includeSubDomains",
	);
	response.headers.set("X-Frame-Options", "DENY");
	response.headers.set("X-Content-Type-Options", "nosniff");

	return response;
}

export const config = {
	matcher: ["/((?!_next|api|static|_vercel|favicon.ico|sitemap.xml).*)"],
};
