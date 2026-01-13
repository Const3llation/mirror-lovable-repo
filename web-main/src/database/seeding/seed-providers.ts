// @ts-nocheck

import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import { serviceProvidersSeed } from "@/database/seeding/data/service-providers";
import { faker } from "@faker-js/faker";
import type { Payload } from "payload";

async function seedServiceProviders(payload: Payload) {
	try {
		console.log("🌱 Starting service providers seeding...");

		// Delete existing providers
		const existingProviders = await payload.find({
			collection: "service-providers",
			limit: 1000,
		});

		console.log(
			`Found ${existingProviders.docs.length} existing providers to delete`,
		);

		for (const provider of existingProviders.docs) {
			await payload.delete({
				collection: "service-providers",
				id: provider.id,
			});
		}

		// Get all categories and subcategories for random assignment
		const categories = await payload.find({
			collection: "categories",
			limit: 1000,
		});

		const subcategories = await payload.find({
			collection: "sub-categories",
			limit: 1000,
		});

		// Create new providers
		for (const provider of serviceProvidersSeed) {
			try {
				// Randomly select categories
				const selectedCategories = faker.helpers.arrayElements(
					categories.docs,
					faker.number.int({ min: 2, max: 5 }),
				);

				// Get available subcategories for selected categories
				const availableSubcategories = subcategories.docs.filter((sub) =>
					selectedCategories.some((cat) => sub.parentCategory.id === cat.id),
				);

				if (availableSubcategories.length === 0) {
					console.warn(
						`No subcategories found for provider ${provider.providerName}, skipping...`,
					);
					continue;
				}

				// Select random subcategories
				const numSubcategories = Math.min(
					availableSubcategories.length,
					faker.number.int({
						min: 1,
						max: Math.max(3, availableSubcategories.length),
					}),
				);
				const selectedSubcategories = faker.helpers.arrayElements(
					availableSubcategories,
					numSubcategories,
				);

				// Process case studies
				const processedCaseStudies = provider.caseStudies?.map((study) => {
					const numServiceCategories = Math.min(
						selectedSubcategories.length,
						faker.number.int({
							min: 1,
							max: Math.min(3, selectedSubcategories.length),
						}),
					);
					return {
						...study,
						timeline: faker.helpers.arrayElement(
							SERVICE_PROVIDER_TIMELINE_OPTIONS,
						).id,
						budget: faker.helpers.arrayElement(SERVICE_PROVIDER_BUDGET_OPTIONS)
							.id,
						serviceCategories: faker.helpers
							.arrayElements(selectedSubcategories, numServiceCategories)
							.map((sub) => sub.id),
					};
				});

				// Create the provider
				await payload.create({
					collection: "service-providers",
					data: {
						...provider,
						caseStudies: processedCaseStudies,
						categories: {
							categories: selectedCategories.map((cat) => cat.id),
							subCategories: selectedSubcategories.map((sub) => sub.id),
						},
					},
				});

				console.log(`Created provider: ${provider.providerName}`);
			} catch (error) {
				console.error(
					`Error creating provider ${provider.providerName}:`,
					error,
				);
				throw error;
			}
		}

		console.log("✅ Service providers seeded successfully");
	} catch (error) {
		console.error("Error seeding service providers:", error);
		throw error;
	}
}

export default seedServiceProviders;
