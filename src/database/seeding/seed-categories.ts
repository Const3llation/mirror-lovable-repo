// @ts-nocheck

import { categoriesSeed } from "@/database/seeding/data/categories";
import type { Payload } from "payload";

async function seedCategories(payload: Payload) {
	try {
		console.log("🌱 Starting categories seeding...");
		console.log("Cleaning existing data...");

		// Delete subcategories FIRST
		const existingSubCategories = await payload.find({
			collection: "sub-categories",
			limit: 1000,
		});

		console.log(
			`Found ${existingSubCategories.docs.length} existing subcategories to delete`,
		);

		for (const subCategory of existingSubCategories.docs) {
			await payload.delete({
				collection: "sub-categories",
				id: subCategory.id,
			});
		}

		// THEN delete categories
		const existingCategories = await payload.find({
			collection: "categories",
			limit: 1000,
		});

		console.log(
			`Found ${existingCategories.docs.length} existing categories to delete`,
		);

		for (const category of existingCategories.docs) {
			await payload.delete({
				collection: "categories",
				id: category.id,
			});
		}
		// Create new data
		console.log("Creating new categories and subcategories...");

		for (const category of categoriesSeed) {
			// Create category
			const categoryDoc = await payload.create({
				collection: "categories",
				data: {
					name: category.name,
					slug: category.slug,
					icon: category.icon,
				},
			});

			// Create subcategories and collect their IDs
			const subCategoryIds = [];

			for (const subCategory of category.subCategories) {
				const subCategoryDoc = await payload.create({
					collection: "sub-categories",
					data: {
						name: subCategory.name,
						parentCategory: categoryDoc.id,
					},
				});

				subCategoryIds.push(subCategoryDoc.id);
			}

			// Update category with subcategory references
			await payload.update({
				collection: "categories",
				id: categoryDoc.id,
				data: {
					subCategories: subCategoryIds,
				},
			});
		}

		console.log("✅ Seeding completed successfully");
	} catch (error) {
		console.error("Error seeding data:", error);
		throw error;
	}
}

export default seedCategories;
