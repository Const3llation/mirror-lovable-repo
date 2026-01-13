// @ts-nocheck
import type { Payload } from "payload";

async function seedFooter(payload: Payload) {
	try {
		console.log("🌱 Starting footer global seeding...");

		await payload.updateGlobal({
			slug: "footer",
			data: {
				navItems: [
					{
						title: "Help Center",
						slug: "help-center",
						visible: "show",
					},
					{
						title: "Privacy Policy",
						slug: "privacy-policy",
						visible: "show",
					},
					{
						title: "Terms and Conditions",
						slug: "terms-and-conditions",
						visible: "show",
					},
				],
				socials: [
					{
						link: "https://x.com",
						icon: "X",
					},
					{
						link: "https://facebook.com",
						icon: "Facebook",
					},
					{
						link: "https://linkedin.com",
						icon: "LinkedIn",
					},
				],
			},
		});

		console.log("✅ footer seeded successfully");
	} catch (error) {
		console.error("Error seeding footer:", error);
		throw error;
	}
}

export default seedFooter;
