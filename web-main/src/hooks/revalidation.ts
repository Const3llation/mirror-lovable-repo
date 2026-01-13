// This hook is called from the 'afterChange' hook in a collection.
// It is used to trigger a revalidation of the Cloudflare cache.
export const revalidationHook = ({ doc, req, collection }: any) => {
	if (process.env.NODE_ENV === "production") {
		const revalidateUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/revalidate`;
		const secret = process.env.PAYLOAD_REVALIDATION_SECRET;

		if (!secret) {
			req.payload.logger.error(
				"A revalidation was triggered, but the PAYLOAD_REVALIDATION_SECRET is not set.",
			);
			return;
		}

		// Perform the revalidation asynchronously
		fetch(revalidateUrl, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-payload-secret": secret,
			},
			body: JSON.stringify({
				collection: collection.slug,
				doc,
			}),
		}).catch((err) => {
			req.payload.logger.error(
				`Error hitting revalidation hook for collection ${collection.slug}, doc ID ${doc.id}: ${err.message}`,
			);
		});
	}

	return doc;
};
