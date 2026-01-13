import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."enum_users_role" AS ENUM('infrastructure', 'admin', 'editor', 'client', 'service_provider');
  CREATE TYPE "public"."enum_users_status" AS ENUM('pending', 'active', 'suspended', 'deleted');
  CREATE TYPE "public"."enum_remote_file_uploads_type" AS ENUM('image', 'document');
  CREATE TYPE "public"."enum_service_providers_addresses_address_type" AS ENUM('Headquarters', 'Branch');
  CREATE TYPE "public"."enum_service_providers_addresses_country" AS ENUM('AD', 'AE', 'AF', 'AG', 'AI', 'AL', 'AM', 'AO', 'AQ', 'AR', 'AS', 'AT', 'AU', 'AW', 'AX', 'AZ', 'BA', 'BB', 'BD', 'BE', 'BF', 'BG', 'BH', 'BI', 'BJ', 'BL', 'BM', 'BN', 'BO', 'BQ', 'BR', 'BS', 'BT', 'BV', 'BW', 'BY', 'BZ', 'CA', 'CC', 'CD', 'CF', 'CG', 'CH', 'CI', 'CK', 'CL', 'CM', 'CN', 'CO', 'CR', 'CU', 'CV', 'CW', 'CX', 'CY', 'CZ', 'DE', 'DJ', 'DK', 'DM', 'DO', 'DZ', 'EC', 'EE', 'EG', 'EH', 'ER', 'ES', 'ET', 'FI', 'FJ', 'FK', 'FM', 'FO', 'FR', 'GA', 'GB', 'GD', 'GE', 'GF', 'GG', 'GH', 'GI', 'GL', 'GM', 'GN', 'GP', 'GQ', 'GR', 'GS', 'GT', 'GU', 'GW', 'GY', 'HK', 'HM', 'HN', 'HR', 'HT', 'HU', 'ID', 'IE', 'IL', 'IM', 'IN', 'IO', 'IQ', 'IS', 'IT', 'JE', 'JM', 'JO', 'JP', 'KE', 'KG', 'KH', 'KI', 'KM', 'KN', 'KR', 'KW', 'KY', 'KZ', 'LA', 'LB', 'LC', 'LI', 'LK', 'LR', 'LS', 'LT', 'LU', 'LV', 'LY', 'MA', 'MC', 'MD', 'ME', 'MF', 'MG', 'MH', 'MK', 'ML', 'MM', 'MN', 'MO', 'MP', 'MQ', 'MR', 'MS', 'MT', 'MU', 'MV', 'MW', 'MX', 'MY', 'MZ', 'NA', 'NC', 'NE', 'NF', 'NG', 'NI', 'NL', 'NO', 'NP', 'NR', 'NU', 'NZ', 'OM', 'PA', 'PE', 'PF', 'PG', 'PH', 'PK', 'PL', 'PM', 'PN', 'PR', 'PS', 'PT', 'PW', 'PY', 'QA', 'RE', 'RO', 'RS', 'RU', 'RW', 'SA', 'SB', 'SC', 'SD', 'SE', 'SG', 'SH', 'SI', 'SJ', 'SK', 'SL', 'SM', 'SN', 'SO', 'SR', 'SS', 'ST', 'SV', 'SX', 'SY', 'SZ', 'TC', 'TD', 'TF', 'TG', 'TH', 'TJ', 'TK', 'TL', 'TM', 'TN', 'TO', 'TR', 'TT', 'TV', 'TW', 'TZ', 'UA', 'UG', 'UM', 'US', 'UY', 'UZ', 'VA', 'VC', 'VE', 'VG', 'VI', 'VN', 'VU', 'WF', 'WS', 'XK', 'YE', 'YT', 'ZA', 'ZM', 'ZW');
  CREATE TYPE "public"."enum_service_providers_case_studies_budget" AS ENUM('less_than_1k', '1k_to_5k', '5k_to_10k', '10k_to_50k', '50k_plus');
  CREATE TYPE "public"."enum_service_providers_case_studies_timeline" AS ENUM('less_than_1_month', '1_to_3_months', '3_to_6_months', '6_to_12_months', '1_year_plus');
  CREATE TYPE "public"."enum_service_providers_created_by" AS ENUM('Admin', 'Service provider');
  CREATE TYPE "public"."enum_service_providers_registration_process_status" AS ENUM('In Progress', 'Completed');
  CREATE TYPE "public"."enum_service_providers_minimum_budget" AS ENUM('less_than_1k', '1k_to_5k', '5k_to_10k', '10k_to_50k', '50k_plus');
  CREATE TYPE "public"."enum_service_providers_company_size" AS ENUM('1-10', '11-50', '51-200', '201-500', '501-1000', '1001+');
  CREATE TYPE "public"."enum_service_providers_visibility_featured" AS ENUM('Yes', 'No');
  CREATE TYPE "public"."enum_service_providers_visibility_status" AS ENUM('Verified', 'Unverified');
  CREATE TYPE "public"."enum_service_providers_visibility_constellation_verified" AS ENUM('Yes', 'No');
  CREATE TYPE "public"."enum_service_providers_visibility_published" AS ENUM('Yes', 'No');
  CREATE TYPE "public"."enum_service_providers_visibility_waiting_for_moderation" AS ENUM('Yes', 'No');
  CREATE TYPE "public"."enum_verify_providers_status" AS ENUM('Pending', 'Approved', 'Rejected');
  CREATE TYPE "public"."enum_verify_providers_email_status" AS ENUM('Pending', 'Verified', 'Expired', 'MaxAttemptsReached');
  CREATE TYPE "public"."enum_provider_reviews_project_budget" AS ENUM('less_than_1k', '1k_to_5k', '5k_to_10k', '10k_to_50k', '50k_plus');
  CREATE TYPE "public"."enum_provider_reviews_project_timeline" AS ENUM('less_than_1_month', '1_to_3_months', '3_to_6_months', '6_to_12_months', '1_year_plus');
  CREATE TYPE "public"."enum_provider_reviews_cashback_crypto" AS ENUM('BSC', 'ERC-20');
  CREATE TYPE "public"."enum_provider_contacts_project_budget" AS ENUM('less_than_1k', '1k_to_5k', '5k_to_10k', '10k_to_50k', '50k_plus');
  CREATE TYPE "public"."enum_provider_contacts_project_timeline" AS ENUM('less_than_1_month', '1_to_3_months', '3_to_6_months', '6_to_12_months', '1_year_plus');
  CREATE TYPE "public"."enum_provider_contacts_cashback_crypto" AS ENUM('BSC', 'ERC-20');
  CREATE TYPE "public"."enum_provider_contacts_status" AS ENUM('pending', 'completed');
  CREATE TYPE "public"."enum_main_navigation_nav_items_is_categories" AS ENUM('yes', 'no');
  CREATE TYPE "public"."enum_footer_nav_items_visible" AS ENUM('show', 'hide');
  CREATE TYPE "public"."enum_footer_socials_visible" AS ENUM('show', 'hide');
  CREATE TABLE IF NOT EXISTS "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"role" "enum_users_role",
  	"status" "enum_users_status",
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "file_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_provider_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "image_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_provider_id" integer,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE IF NOT EXISTS "remote_file_uploads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"type" "enum_remote_file_uploads_type" NOT NULL,
  	"service_provider_id" integer,
  	"remote_u_r_l" varchar NOT NULL,
  	"description" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"address_type" "enum_service_providers_addresses_address_type",
  	"street_address1" varchar,
  	"street_address2" varchar,
  	"city" varchar,
  	"state" varchar,
  	"postal_code" varchar,
  	"country" "enum_service_providers_addresses_country"
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers_case_studies_achieved_metrics" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"metric" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers_case_studies" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"client_name" varchar,
  	"title" varchar,
  	"budget" "enum_service_providers_case_studies_budget",
  	"timeline" "enum_service_providers_case_studies_timeline",
  	"case_study_slug" varchar,
  	"description" varchar,
  	"project_url" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers_team_members" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"first_name" varchar,
  	"last_name" varchar,
  	"position" varchar
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers_findings" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"text" varchar NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"created_by" "enum_service_providers_created_by" DEFAULT 'Admin',
  	"registration_process_status" "enum_service_providers_registration_process_status" DEFAULT 'In Progress',
  	"provider_name" varchar NOT NULL,
  	"slug" varchar,
  	"founded_year" numeric,
  	"provider_short_description" varchar,
  	"provider_description" varchar,
  	"website_url" varchar,
  	"email" varchar NOT NULL,
  	"phone_number" varchar,
  	"telegram_username" varchar,
  	"social_media_links_linkedin" varchar,
  	"social_media_links_twitter" varchar,
  	"social_media_links_youtube" varchar,
  	"social_media_links_facebook" varchar,
  	"social_media_links_instagram" varchar,
  	"social_media_links_behance" varchar,
  	"social_media_links_github" varchar,
  	"social_media_links_custom_web" varchar,
  	"minimum_budget" "enum_service_providers_minimum_budget",
  	"company_size" "enum_service_providers_company_size",
  	"visibility_featured" "enum_service_providers_visibility_featured" DEFAULT 'No',
  	"visibility_status" "enum_service_providers_visibility_status" DEFAULT 'Unverified',
  	"visibility_constellation_verified" "enum_service_providers_visibility_constellation_verified" DEFAULT 'No',
  	"visibility_published" "enum_service_providers_visibility_published" DEFAULT 'No',
  	"visibility_waiting_for_moderation" "enum_service_providers_visibility_waiting_for_moderation" DEFAULT 'Yes',
  	"reviews_count" numeric,
  	"reviews_average" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "service_providers_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"image_uploads_id" integer,
  	"remote_file_uploads_id" integer,
  	"file_uploads_id" integer,
  	"categories_id" integer,
  	"sub_categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"icon" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "categories_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"sub_categories_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "sub_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar,
  	"parent_category_id" integer NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "help_center_items" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"content" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "pages" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"rich_text" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "team_members" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"position" varchar NOT NULL,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"featured_image_id" integer,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"content" jsonb,
  	"content_html" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "blog_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"blog_categories_id" integer,
  	"blog_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "verify_providers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"work_email" varchar NOT NULL,
  	"job_position" varchar NOT NULL,
  	"service_provider_id" integer NOT NULL,
  	"note" varchar NOT NULL,
  	"status" "enum_verify_providers_status" DEFAULT 'Pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "verify_providers_email" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"verification_code" varchar NOT NULL,
  	"attempts" numeric DEFAULT 0,
  	"max_attempts" numeric DEFAULT 3,
  	"status" "enum_verify_providers_email_status" DEFAULT 'Pending',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"expires_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "provider_reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_provider_id" integer NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone_number" varchar NOT NULL,
  	"telegram_username" varchar NOT NULL,
  	"project_description" varchar NOT NULL,
  	"project_budget" "enum_provider_reviews_project_budget" NOT NULL,
  	"project_timeline" "enum_provider_reviews_project_timeline" NOT NULL,
  	"project_proof_of_payment_url" varchar,
  	"review_rating" numeric NOT NULL,
  	"review_review" varchar NOT NULL,
  	"cashback_crypto" "enum_provider_reviews_cashback_crypto" NOT NULL,
  	"cashback_wallet_address" varchar NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "provider_reviews_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"sub_categories_id" integer,
  	"file_uploads_id" integer,
  	"image_uploads_id" integer,
  	"remote_file_uploads_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "provider_contacts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"service_provider_id" integer NOT NULL,
  	"first_name" varchar NOT NULL,
  	"last_name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"telegram_username" varchar NOT NULL,
  	"project_description" varchar NOT NULL,
  	"project_additional_description" varchar NOT NULL,
  	"project_budget" "enum_provider_contacts_project_budget" NOT NULL,
  	"project_timeline" "enum_provider_contacts_project_timeline" NOT NULL,
  	"cashback_crypto" "enum_provider_contacts_cashback_crypto" NOT NULL,
  	"cashback_wallet_address" varchar NOT NULL,
  	"status" "enum_provider_contacts_status" DEFAULT 'pending',
  	"completed_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "provider_contacts_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"categories_id" integer,
  	"sub_categories_id" integer,
  	"file_uploads_id" integer,
  	"image_uploads_id" integer,
  	"remote_file_uploads_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "search" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"priority" numeric,
  	"searchable_text" varchar,
  	"region" varchar,
  	"country" varchar,
  	"company_size" varchar,
  	"status" varchar,
  	"categories" varchar,
  	"sub_categories" varchar,
  	"minimum_budget" varchar,
  	"reviews_average" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "search_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"service_providers_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer,
  	"file_uploads_id" integer,
  	"image_uploads_id" integer,
  	"remote_file_uploads_id" integer,
  	"service_providers_id" integer,
  	"categories_id" integer,
  	"sub_categories_id" integer,
  	"help_center_items_id" integer,
  	"pages_id" integer,
  	"team_members_id" integer,
  	"blog_categories_id" integer,
  	"blog_id" integer,
  	"verify_providers_id" integer,
  	"verify_providers_email_id" integer,
  	"provider_reviews_id" integer,
  	"provider_contacts_id" integer,
  	"search_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation_nav_items_category_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"category_id" integer
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"page_slug" varchar,
  	"is_categories" "enum_main_navigation_nav_items_is_categories" DEFAULT 'no' NOT NULL
  );
  
  CREATE TABLE IF NOT EXISTS "main_navigation" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE IF NOT EXISTS "footer_nav_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"slug" varchar NOT NULL,
  	"visible" "enum_footer_nav_items_visible" DEFAULT 'show'
  );
  
  CREATE TABLE IF NOT EXISTS "footer_socials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" varchar NOT NULL,
  	"link" varchar NOT NULL,
  	"visible" "enum_footer_socials_visible" DEFAULT 'show'
  );
  
  CREATE TABLE IF NOT EXISTS "footer" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DO $$ BEGIN
   ALTER TABLE "file_uploads" ADD CONSTRAINT "file_uploads_service_provider_id_service_providers_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "image_uploads" ADD CONSTRAINT "image_uploads_service_provider_id_service_providers_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "remote_file_uploads" ADD CONSTRAINT "remote_file_uploads_service_provider_id_service_providers_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_addresses" ADD CONSTRAINT "service_providers_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_case_studies_achieved_metrics" ADD CONSTRAINT "service_providers_case_studies_achieved_metrics_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_providers_case_studies"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_case_studies" ADD CONSTRAINT "service_providers_case_studies_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_team_members" ADD CONSTRAINT "service_providers_team_members_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_findings" ADD CONSTRAINT "service_providers_findings_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_rels" ADD CONSTRAINT "service_providers_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_rels" ADD CONSTRAINT "service_providers_rels_image_uploads_fk" FOREIGN KEY ("image_uploads_id") REFERENCES "public"."image_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_rels" ADD CONSTRAINT "service_providers_rels_remote_file_uploads_fk" FOREIGN KEY ("remote_file_uploads_id") REFERENCES "public"."remote_file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_rels" ADD CONSTRAINT "service_providers_rels_file_uploads_fk" FOREIGN KEY ("file_uploads_id") REFERENCES "public"."file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_rels" ADD CONSTRAINT "service_providers_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "service_providers_rels" ADD CONSTRAINT "service_providers_rels_sub_categories_fk" FOREIGN KEY ("sub_categories_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "categories_rels" ADD CONSTRAINT "categories_rels_sub_categories_fk" FOREIGN KEY ("sub_categories_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "sub_categories" ADD CONSTRAINT "sub_categories_parent_category_id_categories_id_fk" FOREIGN KEY ("parent_category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "team_members" ADD CONSTRAINT "team_members_image_id_image_uploads_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."image_uploads"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blog" ADD CONSTRAINT "blog_featured_image_id_image_uploads_id_fk" FOREIGN KEY ("featured_image_id") REFERENCES "public"."image_uploads"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "verify_providers" ADD CONSTRAINT "verify_providers_service_provider_id_service_providers_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews" ADD CONSTRAINT "provider_reviews_service_provider_id_service_providers_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews_rels" ADD CONSTRAINT "provider_reviews_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."provider_reviews"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews_rels" ADD CONSTRAINT "provider_reviews_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews_rels" ADD CONSTRAINT "provider_reviews_rels_sub_categories_fk" FOREIGN KEY ("sub_categories_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews_rels" ADD CONSTRAINT "provider_reviews_rels_file_uploads_fk" FOREIGN KEY ("file_uploads_id") REFERENCES "public"."file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews_rels" ADD CONSTRAINT "provider_reviews_rels_image_uploads_fk" FOREIGN KEY ("image_uploads_id") REFERENCES "public"."image_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_reviews_rels" ADD CONSTRAINT "provider_reviews_rels_remote_file_uploads_fk" FOREIGN KEY ("remote_file_uploads_id") REFERENCES "public"."remote_file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts" ADD CONSTRAINT "provider_contacts_service_provider_id_service_providers_id_fk" FOREIGN KEY ("service_provider_id") REFERENCES "public"."service_providers"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts_rels" ADD CONSTRAINT "provider_contacts_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."provider_contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts_rels" ADD CONSTRAINT "provider_contacts_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts_rels" ADD CONSTRAINT "provider_contacts_rels_sub_categories_fk" FOREIGN KEY ("sub_categories_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts_rels" ADD CONSTRAINT "provider_contacts_rels_file_uploads_fk" FOREIGN KEY ("file_uploads_id") REFERENCES "public"."file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts_rels" ADD CONSTRAINT "provider_contacts_rels_image_uploads_fk" FOREIGN KEY ("image_uploads_id") REFERENCES "public"."image_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "provider_contacts_rels" ADD CONSTRAINT "provider_contacts_rels_remote_file_uploads_fk" FOREIGN KEY ("remote_file_uploads_id") REFERENCES "public"."remote_file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_service_providers_fk" FOREIGN KEY ("service_providers_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_file_uploads_fk" FOREIGN KEY ("file_uploads_id") REFERENCES "public"."file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_image_uploads_fk" FOREIGN KEY ("image_uploads_id") REFERENCES "public"."image_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_remote_file_uploads_fk" FOREIGN KEY ("remote_file_uploads_id") REFERENCES "public"."remote_file_uploads"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_service_providers_fk" FOREIGN KEY ("service_providers_id") REFERENCES "public"."service_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_categories_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_sub_categories_fk" FOREIGN KEY ("sub_categories_id") REFERENCES "public"."sub_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_help_center_items_fk" FOREIGN KEY ("help_center_items_id") REFERENCES "public"."help_center_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_pages_fk" FOREIGN KEY ("pages_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_team_members_fk" FOREIGN KEY ("team_members_id") REFERENCES "public"."team_members"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_blog_fk" FOREIGN KEY ("blog_id") REFERENCES "public"."blog"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verify_providers_fk" FOREIGN KEY ("verify_providers_id") REFERENCES "public"."verify_providers"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_verify_providers_email_fk" FOREIGN KEY ("verify_providers_email_id") REFERENCES "public"."verify_providers_email"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_provider_reviews_fk" FOREIGN KEY ("provider_reviews_id") REFERENCES "public"."provider_reviews"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_provider_contacts_fk" FOREIGN KEY ("provider_contacts_id") REFERENCES "public"."provider_contacts"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_search_fk" FOREIGN KEY ("search_id") REFERENCES "public"."search"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_nav_items_category_items" ADD CONSTRAINT "main_navigation_nav_items_category_items_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_nav_items_category_items" ADD CONSTRAINT "main_navigation_nav_items_category_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "main_navigation_nav_items" ADD CONSTRAINT "main_navigation_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."main_navigation"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_nav_items" ADD CONSTRAINT "footer_nav_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  DO $$ BEGIN
   ALTER TABLE "footer_socials" ADD CONSTRAINT "footer_socials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "file_uploads_service_provider_idx" ON "file_uploads" USING btree ("service_provider_id");
  CREATE INDEX IF NOT EXISTS "file_uploads_updated_at_idx" ON "file_uploads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "file_uploads_created_at_idx" ON "file_uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "file_uploads_filename_idx" ON "file_uploads" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "image_uploads_service_provider_idx" ON "image_uploads" USING btree ("service_provider_id");
  CREATE INDEX IF NOT EXISTS "image_uploads_updated_at_idx" ON "image_uploads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "image_uploads_created_at_idx" ON "image_uploads" USING btree ("created_at");
  CREATE UNIQUE INDEX IF NOT EXISTS "image_uploads_filename_idx" ON "image_uploads" USING btree ("filename");
  CREATE INDEX IF NOT EXISTS "remote_file_uploads_service_provider_idx" ON "remote_file_uploads" USING btree ("service_provider_id");
  CREATE INDEX IF NOT EXISTS "remote_file_uploads_updated_at_idx" ON "remote_file_uploads" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "remote_file_uploads_created_at_idx" ON "remote_file_uploads" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "service_providers_addresses_order_idx" ON "service_providers_addresses" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "service_providers_addresses_parent_id_idx" ON "service_providers_addresses" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "service_providers_case_studies_achieved_metrics_order_idx" ON "service_providers_case_studies_achieved_metrics" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "service_providers_case_studies_achieved_metrics_parent_id_idx" ON "service_providers_case_studies_achieved_metrics" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "service_providers_case_studies_order_idx" ON "service_providers_case_studies" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "service_providers_case_studies_parent_id_idx" ON "service_providers_case_studies" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "service_providers_team_members_order_idx" ON "service_providers_team_members" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "service_providers_team_members_parent_id_idx" ON "service_providers_team_members" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "service_providers_findings_order_idx" ON "service_providers_findings" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "service_providers_findings_parent_id_idx" ON "service_providers_findings" USING btree ("_parent_id");
  CREATE UNIQUE INDEX IF NOT EXISTS "service_providers_provider_name_idx" ON "service_providers" USING btree ("provider_name");
  CREATE UNIQUE INDEX IF NOT EXISTS "service_providers_email_idx" ON "service_providers" USING btree ("email");
  CREATE INDEX IF NOT EXISTS "service_providers_updated_at_idx" ON "service_providers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "service_providers_created_at_idx" ON "service_providers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_order_idx" ON "service_providers_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_parent_idx" ON "service_providers_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_path_idx" ON "service_providers_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_image_uploads_id_idx" ON "service_providers_rels" USING btree ("image_uploads_id");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_remote_file_uploads_id_idx" ON "service_providers_rels" USING btree ("remote_file_uploads_id");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_file_uploads_id_idx" ON "service_providers_rels" USING btree ("file_uploads_id");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_categories_id_idx" ON "service_providers_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "service_providers_rels_sub_categories_id_idx" ON "service_providers_rels" USING btree ("sub_categories_id");
  CREATE INDEX IF NOT EXISTS "categories_name_idx" ON "categories" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "categories_updated_at_idx" ON "categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "categories_created_at_idx" ON "categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "categories_rels_order_idx" ON "categories_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "categories_rels_parent_idx" ON "categories_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "categories_rels_path_idx" ON "categories_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "categories_rels_sub_categories_id_idx" ON "categories_rels" USING btree ("sub_categories_id");
  CREATE INDEX IF NOT EXISTS "sub_categories_name_idx" ON "sub_categories" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "sub_categories_parent_category_idx" ON "sub_categories" USING btree ("parent_category_id");
  CREATE INDEX IF NOT EXISTS "sub_categories_updated_at_idx" ON "sub_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "sub_categories_created_at_idx" ON "sub_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "help_center_items_updated_at_idx" ON "help_center_items" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "help_center_items_created_at_idx" ON "help_center_items" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "pages_updated_at_idx" ON "pages" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "pages_created_at_idx" ON "pages" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "team_members_image_idx" ON "team_members" USING btree ("image_id");
  CREATE INDEX IF NOT EXISTS "team_members_updated_at_idx" ON "team_members" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "team_members_created_at_idx" ON "team_members" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_categories_name_idx" ON "blog_categories" USING btree ("name");
  CREATE INDEX IF NOT EXISTS "blog_categories_slug_idx" ON "blog_categories" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_categories_updated_at_idx" ON "blog_categories" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_categories_created_at_idx" ON "blog_categories" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_featured_image_idx" ON "blog" USING btree ("featured_image_id");
  CREATE INDEX IF NOT EXISTS "blog_title_idx" ON "blog" USING btree ("title");
  CREATE INDEX IF NOT EXISTS "blog_slug_idx" ON "blog" USING btree ("slug");
  CREATE INDEX IF NOT EXISTS "blog_updated_at_idx" ON "blog" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "blog_created_at_idx" ON "blog" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "blog_rels_order_idx" ON "blog_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "blog_rels_parent_idx" ON "blog_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "blog_rels_path_idx" ON "blog_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "blog_rels_blog_categories_id_idx" ON "blog_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "blog_rels_blog_id_idx" ON "blog_rels" USING btree ("blog_id");
  CREATE INDEX IF NOT EXISTS "verify_providers_service_provider_idx" ON "verify_providers" USING btree ("service_provider_id");
  CREATE INDEX IF NOT EXISTS "verify_providers_updated_at_idx" ON "verify_providers" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "verify_providers_created_at_idx" ON "verify_providers" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "verify_providers_email_updated_at_idx" ON "verify_providers_email" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "provider_reviews_service_provider_idx" ON "provider_reviews" USING btree ("service_provider_id");
  CREATE INDEX IF NOT EXISTS "provider_reviews_updated_at_idx" ON "provider_reviews" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_order_idx" ON "provider_reviews_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_parent_idx" ON "provider_reviews_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_path_idx" ON "provider_reviews_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_categories_id_idx" ON "provider_reviews_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_sub_categories_id_idx" ON "provider_reviews_rels" USING btree ("sub_categories_id");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_file_uploads_id_idx" ON "provider_reviews_rels" USING btree ("file_uploads_id");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_image_uploads_id_idx" ON "provider_reviews_rels" USING btree ("image_uploads_id");
  CREATE INDEX IF NOT EXISTS "provider_reviews_rels_remote_file_uploads_id_idx" ON "provider_reviews_rels" USING btree ("remote_file_uploads_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_service_provider_idx" ON "provider_contacts" USING btree ("service_provider_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_updated_at_idx" ON "provider_contacts" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_order_idx" ON "provider_contacts_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_parent_idx" ON "provider_contacts_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_path_idx" ON "provider_contacts_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_categories_id_idx" ON "provider_contacts_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_sub_categories_id_idx" ON "provider_contacts_rels" USING btree ("sub_categories_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_file_uploads_id_idx" ON "provider_contacts_rels" USING btree ("file_uploads_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_image_uploads_id_idx" ON "provider_contacts_rels" USING btree ("image_uploads_id");
  CREATE INDEX IF NOT EXISTS "provider_contacts_rels_remote_file_uploads_id_idx" ON "provider_contacts_rels" USING btree ("remote_file_uploads_id");
  CREATE INDEX IF NOT EXISTS "search_searchable_text_idx" ON "search" USING btree ("searchable_text");
  CREATE INDEX IF NOT EXISTS "search_region_idx" ON "search" USING btree ("region");
  CREATE INDEX IF NOT EXISTS "search_country_idx" ON "search" USING btree ("country");
  CREATE INDEX IF NOT EXISTS "search_company_size_idx" ON "search" USING btree ("company_size");
  CREATE INDEX IF NOT EXISTS "search_status_idx" ON "search" USING btree ("status");
  CREATE INDEX IF NOT EXISTS "search_categories_idx" ON "search" USING btree ("categories");
  CREATE INDEX IF NOT EXISTS "search_sub_categories_idx" ON "search" USING btree ("sub_categories");
  CREATE INDEX IF NOT EXISTS "search_minimum_budget_idx" ON "search" USING btree ("minimum_budget");
  CREATE INDEX IF NOT EXISTS "search_reviews_average_idx" ON "search" USING btree ("reviews_average");
  CREATE INDEX IF NOT EXISTS "search_updated_at_idx" ON "search" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "search_created_at_idx" ON "search" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "search_rels_order_idx" ON "search_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "search_rels_parent_idx" ON "search_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "search_rels_path_idx" ON "search_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "search_rels_service_providers_id_idx" ON "search_rels" USING btree ("service_providers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_file_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("file_uploads_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_image_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("image_uploads_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_remote_file_uploads_id_idx" ON "payload_locked_documents_rels" USING btree ("remote_file_uploads_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_service_providers_id_idx" ON "payload_locked_documents_rels" USING btree ("service_providers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_sub_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("sub_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_help_center_items_id_idx" ON "payload_locked_documents_rels" USING btree ("help_center_items_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_pages_id_idx" ON "payload_locked_documents_rels" USING btree ("pages_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_team_members_id_idx" ON "payload_locked_documents_rels" USING btree ("team_members_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_categories_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_blog_id_idx" ON "payload_locked_documents_rels" USING btree ("blog_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_verify_providers_id_idx" ON "payload_locked_documents_rels" USING btree ("verify_providers_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_verify_providers_email_id_idx" ON "payload_locked_documents_rels" USING btree ("verify_providers_email_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_provider_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("provider_reviews_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_provider_contacts_id_idx" ON "payload_locked_documents_rels" USING btree ("provider_contacts_id");
  CREATE INDEX IF NOT EXISTS "payload_locked_documents_rels_search_id_idx" ON "payload_locked_documents_rels" USING btree ("search_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX IF NOT EXISTS "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX IF NOT EXISTS "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX IF NOT EXISTS "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX IF NOT EXISTS "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX IF NOT EXISTS "main_navigation_nav_items_category_items_order_idx" ON "main_navigation_nav_items_category_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_navigation_nav_items_category_items_parent_id_idx" ON "main_navigation_nav_items_category_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_nav_items_category_items_category_idx" ON "main_navigation_nav_items_category_items" USING btree ("category_id");
  CREATE INDEX IF NOT EXISTS "main_navigation_nav_items_order_idx" ON "main_navigation_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "main_navigation_nav_items_parent_id_idx" ON "main_navigation_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_order_idx" ON "footer_nav_items" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_nav_items_parent_id_idx" ON "footer_nav_items" USING btree ("_parent_id");
  CREATE INDEX IF NOT EXISTS "footer_socials_order_idx" ON "footer_socials" USING btree ("_order");
  CREATE INDEX IF NOT EXISTS "footer_socials_parent_id_idx" ON "footer_socials" USING btree ("_parent_id");`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   DROP TABLE "users" CASCADE;
  DROP TABLE "file_uploads" CASCADE;
  DROP TABLE "image_uploads" CASCADE;
  DROP TABLE "remote_file_uploads" CASCADE;
  DROP TABLE "service_providers_addresses" CASCADE;
  DROP TABLE "service_providers_case_studies_achieved_metrics" CASCADE;
  DROP TABLE "service_providers_case_studies" CASCADE;
  DROP TABLE "service_providers_team_members" CASCADE;
  DROP TABLE "service_providers_findings" CASCADE;
  DROP TABLE "service_providers" CASCADE;
  DROP TABLE "service_providers_rels" CASCADE;
  DROP TABLE "categories" CASCADE;
  DROP TABLE "categories_rels" CASCADE;
  DROP TABLE "sub_categories" CASCADE;
  DROP TABLE "help_center_items" CASCADE;
  DROP TABLE "pages" CASCADE;
  DROP TABLE "team_members" CASCADE;
  DROP TABLE "blog_categories" CASCADE;
  DROP TABLE "blog" CASCADE;
  DROP TABLE "blog_rels" CASCADE;
  DROP TABLE "verify_providers" CASCADE;
  DROP TABLE "verify_providers_email" CASCADE;
  DROP TABLE "provider_reviews" CASCADE;
  DROP TABLE "provider_reviews_rels" CASCADE;
  DROP TABLE "provider_contacts" CASCADE;
  DROP TABLE "provider_contacts_rels" CASCADE;
  DROP TABLE "search" CASCADE;
  DROP TABLE "search_rels" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "main_navigation_nav_items_category_items" CASCADE;
  DROP TABLE "main_navigation_nav_items" CASCADE;
  DROP TABLE "main_navigation" CASCADE;
  DROP TABLE "footer_nav_items" CASCADE;
  DROP TABLE "footer_socials" CASCADE;
  DROP TABLE "footer" CASCADE;
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_users_status";
  DROP TYPE "public"."enum_remote_file_uploads_type";
  DROP TYPE "public"."enum_service_providers_addresses_address_type";
  DROP TYPE "public"."enum_service_providers_addresses_country";
  DROP TYPE "public"."enum_service_providers_case_studies_budget";
  DROP TYPE "public"."enum_service_providers_case_studies_timeline";
  DROP TYPE "public"."enum_service_providers_created_by";
  DROP TYPE "public"."enum_service_providers_registration_process_status";
  DROP TYPE "public"."enum_service_providers_minimum_budget";
  DROP TYPE "public"."enum_service_providers_company_size";
  DROP TYPE "public"."enum_service_providers_visibility_featured";
  DROP TYPE "public"."enum_service_providers_visibility_status";
  DROP TYPE "public"."enum_service_providers_visibility_constellation_verified";
  DROP TYPE "public"."enum_service_providers_visibility_published";
  DROP TYPE "public"."enum_service_providers_visibility_waiting_for_moderation";
  DROP TYPE "public"."enum_verify_providers_status";
  DROP TYPE "public"."enum_verify_providers_email_status";
  DROP TYPE "public"."enum_provider_reviews_project_budget";
  DROP TYPE "public"."enum_provider_reviews_project_timeline";
  DROP TYPE "public"."enum_provider_reviews_cashback_crypto";
  DROP TYPE "public"."enum_provider_contacts_project_budget";
  DROP TYPE "public"."enum_provider_contacts_project_timeline";
  DROP TYPE "public"."enum_provider_contacts_cashback_crypto";
  DROP TYPE "public"."enum_provider_contacts_status";
  DROP TYPE "public"."enum_main_navigation_nav_items_is_categories";
  DROP TYPE "public"."enum_footer_nav_items_visible";
  DROP TYPE "public"."enum_footer_socials_visible";`);
}
