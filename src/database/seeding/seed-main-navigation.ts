// @ts-nocheck
import type { Payload } from "payload";

async function seedMainNavigation(payload: Payload) {
	try {
		console.log("🌱 Starting main navigation seeding...");

		const categories = await payload.find({
			collection: "categories",
			limit: 1000,
		});

		const categoryIds = categories.docs.map((category) => category.id);

		await payload.updateGlobal({
			slug: "main-navigation",
			data: {
				navItems: [
					{
						title: "Explore",
						"page-slug": "explore",
						"is-categories": "no",
					},
					{
						title: "Categories",
						"page-slug": "categories",
						"is-categories": "yes",
						categoryItems: categoryIds.map((id) => ({
							category: id,
						})),
					},
					{
						title: "Blog",
						"page-slug": "blog",
						"is-categories": "no",
					},
					{
						title: "About us",
						"page-slug": "about",
						"is-categories": "no",
					},
					{
						title: "Contact",
						"page-slug": "contact",
						"is-categories": "no",
					},
				],
			},
		});

		console.log("✅ Main navigation seeded successfully");
	} catch (error) {
		console.error("Error seeding main navigation:", error);
		throw error;
	}
}

export default seedMainNavigation;
