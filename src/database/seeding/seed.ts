import config from "@payload-config";
import { getPayload } from "payload";

import seedBlog from "@/database/seeding/seed-blog";
import seedBlogCategories from "@/database/seeding/seed-blog-categories";
import seedCategories from "@/database/seeding/seed-categories";
import seedFooter from "@/database/seeding/seed-footer";
import seedHelpCenter from "@/database/seeding/seed-help-center";
import seedMainNavigation from "@/database/seeding/seed-main-navigation";
import seedServiceProviders from "@/database/seeding/seed-providers";
import seedTeamMembers from "@/database/seeding/seed-team-members";

async function main() {
	const payload = await getPayload({
		config,
	});

	await seedCategories(payload);
	await seedServiceProviders(payload);
	await seedMainNavigation(payload);
	await seedHelpCenter(payload);
	await seedTeamMembers(payload);
	await seedBlogCategories(payload);
	await seedBlog(payload);
	await seedFooter(payload);

	process.exit(0);
}

main();
