import payload from "@/lib/payload";

const fetchPageContent = async (slug: string) => {
	return await payload.find({
		collection: "pages",
		where: {
			slug: {
				equals: slug,
			},
		},
		limit: 1,
	});
};

export const useContentPage = async (slug: string) => {
	const data = await fetchPageContent(slug);

	return data?.docs[0] || null;
};
