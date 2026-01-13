import { faker } from "@faker-js/faker";
import type { Payload } from "payload";

async function seedTeamMembers(payload: Payload) {
	try {
		console.log("🌱 Starting team members seeding...");

		const teamMembersItems = await payload.find({
			collection: "team-members",
			limit: 1000,
		});

		console.log(
			`Found ${teamMembersItems.docs.length} existing team members items to delete`,
		);

		for (const item of teamMembersItems.docs) {
			await payload.delete({
				collection: "team-members",
				id: item.id,
			});
		}

		for (let i = 0; i < 10; i++) {
			await payload.create({
				collection: "team-members",
				data: {
					name: faker.person.fullName(),
					position: faker.person.jobTitle(),
				},
			});
		}

		console.log("✅ Team members seeded successfully");
	} catch (error) {
		console.error("Error seeding team members:", error);
		throw error;
	}
}

export default seedTeamMembers;
