import payload from "@/lib/payload";

export default async function getPost(slug: string) {
	const data = await payload.find({
		collection: "blog",
		limit: 1,
		where: {
			slug: {
				equals: slug,
			},
		},
		depth: 2,
	});

	return data?.docs[0];
}
