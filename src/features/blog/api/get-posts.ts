import payload from "@/lib/payload";

export default async function getPosts(category: string | null, page: string) {
	const { docs: blogDocs, ...pagination } = await payload.find({
		collection: "blog",
		limit: 15,
		page: Number.parseInt(page),
		where: category ? { "categories.slug": { equals: category } } : undefined,
		depth: 1,
	});

	const blogPosts = blogDocs.map((blogPost) => ({
		id: blogPost.id,
		title: blogPost.title,
		featuredImage: blogPost.featuredImage,
		slug: blogPost.slug,
		category: blogPost.categories
			? {
					id: blogPost.categories.id,
					name: blogPost.categories.name,
					slug: blogPost.categories.slug,
				}
			: null,
	}));

	return { blogPosts, pagination };
}
