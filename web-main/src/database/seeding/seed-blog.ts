import getCategories from "@/features/blog/api/get-categories";
import { faker } from "@faker-js/faker";
import type { Payload } from "payload";

async function seedBlogCategories(payload: Payload) {
	try {
		console.log("🌱 Starting blog seeding...");
		console.log("Cleaning existing data...");

		const existingBlog = await payload.find({
			collection: "blog",
			limit: 1000,
		});

		console.log(
			`Found ${existingBlog.docs.length} existing blog categories to delete`,
		);

		for (const blogCategory of existingBlog.docs) {
			await payload.delete({
				collection: "blog",
				id: blogCategory.id,
			});
		}

		console.log("Creating new blog categories...");

		const blogCategories = await getCategories();
		const blogCategoriesIds = blogCategories.map((category) => category.id);

		for (let i = 0; i < 150; ++i) {
			const title = faker.lorem.sentence();
			const category = Number(faker.helpers.arrayElement(blogCategoriesIds));

			await payload.create({
				collection: "blog",
				data: {
					title,
					slug: faker.helpers.slugify(title).toLocaleLowerCase(),
					category,
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
