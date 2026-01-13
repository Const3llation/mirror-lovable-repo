// @ts-nocheck

import type { ServiceProvider } from "@/types/payload";
import { faker } from "@faker-js/faker";

const generateSocialMediaLinks = () => ({
	linkedin: faker.internet.url(),
	twitter: faker.internet.url(),
	github: faker.internet.url(),
	customWeb: faker.internet.url(),
	youtube: faker.internet.url(),
	facebook: faker.internet.url(),
	instagram: faker.internet.url(),
	behance: faker.internet.url(),
});

const generateAddress = () => ({
	addressType: faker.helpers.arrayElement(["Headquarters", "Branch"] as const),
	streetAddress1: faker.location.streetAddress(),
	streetAddress2: faker.helpers.maybe(() => faker.location.secondaryAddress()),
	city: faker.location.city(),
	state: faker.location.state(),
	postalCode: faker.location.zipCode(),
	country: faker.helpers.arrayElement(["US", "GB", "DE", "FR"] as const),
});

const generateCaseStudy = () => ({
	clientName: faker.company.name(),
	title: faker.company.catchPhrase(),
	description: faker.lorem.paragraph(),
	projectUrl: faker.internet.url(),
	serviceCategories: [], // Will be populated during seeding
	achievedMetrics: Array.from(
		{ length: faker.number.int({ min: 1, max: 3 }) },
		() => ({
			metric: faker.lorem.sentence({ min: 10, max: 20 }),
		}),
	),
});

const generateTeamMember = () => ({
	firstName: faker.person.firstName(),
	lastName: faker.person.lastName(),
	position: faker.person.jobTitle(),
});

export const serviceProvidersSeed: Partial<ServiceProvider>[] = Array.from(
	{ length: 20 },
	() => {
		const providerName = faker.company.name();
		return {
			providerName,
			slug: faker.helpers.slugify(providerName),
			foundedYear: faker.number.int({ min: 1990, max: 2023 }),
			registrationProcessStatus: "Completed",
			providerShortDescription: faker.lorem.text({ min: 280, max: 300 }),
			providerDescription: faker.lorem.text({ min: 580, max: 600 }),
			websiteUrl: faker.internet.url(),
			email: faker.internet.email(),
			phoneNumber: faker.phone.number(),
			telegramUsername: faker.internet.userName(),
			socialMediaLinks: generateSocialMediaLinks(),
			addresses: Array.from(
				{ length: faker.number.int({ min: 1, max: 3 }) },
				generateAddress,
			),
			caseStudies: Array.from(
				{ length: faker.number.int({ min: 1, max: 3 }) },
				generateCaseStudy,
			),
			companySize: faker.helpers.arrayElement([
				"1-10",
				"11-50",
				"51-200",
				"201-500",
				"501-1000",
				"1001+",
			] as const),
			teamMembers: Array.from(
				{ length: faker.number.int({ min: 2, max: 4 }) },
				generateTeamMember,
			),
			visibility: {
				featured: faker.helpers.arrayElement(["Yes", "No"] as const),
				status: faker.helpers.arrayElement(["Verified", "Unverified"] as const),
				published: faker.helpers.arrayElement(["Yes", "No"] as const),
				waitingForModeration: faker.helpers.arrayElement([
					"Yes",
					"No",
				] as const),
			},
			categories: {
				categories: [],
				subCategories: [],
			},
			createdBy: faker.helpers.arrayElement([
				"Admin",
				"Service provider",
			] as const),
		};
	},
);
