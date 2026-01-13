// @ts-nocheck
import type { Payload } from "payload";

const dataToSeed = [
	{
		title: "What services does CONST3LLATION offer?",
		content:
			"CONST3LLATION connects you with vetted web3 service providers offering marketing, development, legal expertise, token listings, and more.",
	},
	{
		title: "Can I trust the partners listed on CONST3LLATION?",
		content:
			"Yes. We only work with partners that pass our vetting process to ensure credibility and proven results.",
	},
	{
		title: "How does the platform verify partners?",
		content:
			"We thoroughly vet every service provider listed on our platform to ensure they meet our standards of credibility, professionalism, and expertise. \n Starting with an analysis of case-studies submitted for our consideration, we dive deep into performance claims and comprehensively examine results data. We also consult with past clients on their direct experiences in order to establish a quantitative & qualitative conclusion on the service provider’s overall credibility.",
	},
	{
		title: "How do I contact a service provider?",
		content:
			'After browsing partner profiles, use the "Contact" button to send your inquiry directly. Shortly after that, you should expect the service provider to get in touch with you.',
	},
	{
		title: "How do I claim cashback?",
		content:
			"Once you complete a project with a partner, leave a review and submit your budget details to claim up to 5% cashback. We'll verify the details with the service provider before processing your reward.",
	},
	{
		title: "How is the cashback amount calculated?",
		content:
			"CONST3LLATION earns a referral fee from our partners, which we share with you in order to reward your collaboration and feedback. When you complete a project with a service provider and submit your review, we calculate up to 5% cashback based on the budget you reported, which is then verified by the partner. ",
	},
	{
		title: "What services are available on CONST3LLATION?",
		content:
			"You can find service providers offering marketing, development, legal support, SEO, and many more services tailored for web3 projects.",
	},
];

async function seedHelpCenter(payload: Payload) {
	try {
		console.log("🌱 Starting help center seeding...");

		const helpCenterItems = await payload.find({
			collection: "help-center-items",
			limit: 1000,
		});

		console.log(
			`Found ${helpCenterItems.docs.length} existing help center items to delete`,
		);

		for (const item of helpCenterItems.docs) {
			await payload.delete({
				collection: "help-center-items",
				id: item.id,
			});
		}

		for (const item of dataToSeed) {
			await payload.create({
				collection: "help-center-items",
				data: item,
			});
		}

		console.log("✅ Help center seeded successfully");
	} catch (error) {
		console.error("Error seeding help center:", error);
		throw error;
	}
}

export default seedHelpCenter;
