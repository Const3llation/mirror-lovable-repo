// @ts-nocheck

import type { Payload } from "payload";

export const blogCategoriesSeed = [
	{ name: "Web3 Basics", slug: "web3-basics" },
	{ name: "Project Development", slug: "project-development" },
	{ name: "Tokenomics", slug: "tokenomics" },
	{ name: "DAOs & Governance", slug: "daos-and-governance" },
	{ name: "Trends & Tools", slug: "trends-and-tools" },
];

async function seedBlogCategories(payload: Payload) {
	try {
		console.log("🌱 Starting blog categories seeding...");
		console.log("Cleaning existing data...");

		const existingBlogCategories = await payload.find({
			collection: "blog-categories",
			limit: 1000,
		});

		console.log(
			`Found ${existingBlogCategories.docs.length} existing blog categories to delete`,
		);

		for (const blogCategory of existingBlogCategories.docs) {
			await payload.delete({
				collection: "blog-categories",
				id: blogCategory.id,
			});
		}

		console.log("Creating new blog categories...");

		for (const category of blogCategoriesSeed) {
			const categoryDoc = await payload.create({
				collection: "blog-categories",
				data: {
					name: category.name,
					slug: category.slug,
				},
			});
		}

		console.log("✅ Seeding completed successfully");
	} catch (error) {
		console.error("Error seeding data:", error);
		throw error;
	}
}

export default seedBlogCategories;
