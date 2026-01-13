import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<Response> {
	// 1. Authenticate the request from Payload
	const secret = request.headers.get("x-payload-secret");
	if (secret !== process.env.PAYLOAD_REVALIDATION_SECRET) {
		return new NextResponse("Invalid token", { status: 401 });
	}

	// 2. Call Cloudflare API to purge everything
	const cloudflareZoneId = process.env.CLOUDFLARE_ZONE_ID;
	const cloudflareApiToken = process.env.CLOUDFLARE_API_TOKEN;

	if (!cloudflareZoneId || !cloudflareApiToken) {
		console.error("Cloudflare environment variables are not set.");
		return new NextResponse("Server configuration error", { status: 500 });
	}

	try {
		const response = await fetch(
			`https://api.cloudflare.com/client/v4/zones/${cloudflareZoneId}/purge_cache`,
			{
				method: "POST",
				headers: {
					Authorization: `Bearer ${cloudflareApiToken}`,
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ purge_everything: true }),
			},
		);

		const data = await response.json();

		if (!response.ok || !data.success) {
			console.error("Cloudflare purge failed:", data.errors);
			return new NextResponse(
				JSON.stringify({ success: false, errors: data.errors }),
				{ status: 500 },
			);
		}

		return NextResponse.json({
			success: true,
			message: "Cloudflare cache purged.",
		});
	} catch (err) {
		console.error(err);
		return new NextResponse("Error purging Cloudflare cache", { status: 500 });
	}
}
