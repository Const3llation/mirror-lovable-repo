import payload from "@/lib/payload";

export default async function getCategories() {
	const { docs } = await payload.find({
		collection: "blog-categories",
		limit: 1000,
	});

	const blogCategories = docs.map((category) => ({
		id: category.id,
		label: category.name,
		value: category.slug,
	}));

	return blogCategories;
}
