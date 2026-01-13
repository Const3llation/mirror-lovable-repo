import * as migration_20250215_125827_initial from "./20250215_125827_initial";
import * as migration_20250221_194301_single_blog_post_category from "./20250221_194301_single_blog_post_category";
import * as migration_20250223_112158_add_status_reviews from "./20250223_112158_add_status_reviews";
import * as migration_20250310_154541_add_contact_submissions from "./20250310_154541_add_contact_submissions";
import * as migration_20250408_185259_remove_const3llation_verified from "./20250408_185259_remove_const3llation_verified";

export const migrations = [
	{
		up: migration_20250215_125827_initial.up,
		down: migration_20250215_125827_initial.down,
		name: "20250215_125827_initial",
	},
	{
		up: migration_20250221_194301_single_blog_post_category.up,
		down: migration_20250221_194301_single_blog_post_category.down,
		name: "20250221_194301_single_blog_post_category",
	},
	{
		up: migration_20250223_112158_add_status_reviews.up,
		down: migration_20250223_112158_add_status_reviews.down,
		name: "20250223_112158_add_status_reviews",
	},
	{
		up: migration_20250310_154541_add_contact_submissions.up,
		down: migration_20250310_154541_add_contact_submissions.down,
		name: "20250310_154541_add_contact_submissions",
	},
	{
		up: migration_20250408_185259_remove_const3llation_verified.up,
		down: migration_20250408_185259_remove_const3llation_verified.down,
		name: "20250408_185259_remove_const3llation_verified",
	},
];
