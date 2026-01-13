import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "blog_rels" DROP CONSTRAINT "blog_rels_blog_categories_fk";
  
  DROP INDEX IF EXISTS "blog_rels_blog_categories_id_idx";
  ALTER TABLE "categories" ADD COLUMN "description" jsonb;
  ALTER TABLE "blog" ADD COLUMN "categories_id" integer;
  DO $$ BEGIN
   ALTER TABLE "blog" ADD CONSTRAINT "blog_categories_id_blog_categories_id_fk" FOREIGN KEY ("categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE set null ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "blog_categories_idx" ON "blog" USING btree ("categories_id");
  ALTER TABLE "blog_rels" DROP COLUMN IF EXISTS "blog_categories_id";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "blog" DROP CONSTRAINT "blog_categories_id_blog_categories_id_fk";
  
  DROP INDEX IF EXISTS "blog_categories_idx";
  ALTER TABLE "blog_rels" ADD COLUMN "blog_categories_id" integer;
  DO $$ BEGIN
   ALTER TABLE "blog_rels" ADD CONSTRAINT "blog_rels_blog_categories_fk" FOREIGN KEY ("blog_categories_id") REFERENCES "public"."blog_categories"("id") ON DELETE cascade ON UPDATE no action;
  EXCEPTION
   WHEN duplicate_object THEN null;
  END $$;
  
  CREATE INDEX IF NOT EXISTS "blog_rels_blog_categories_id_idx" ON "blog_rels" USING btree ("blog_categories_id");
  ALTER TABLE "categories" DROP COLUMN IF EXISTS "description";
  ALTER TABLE "blog" DROP COLUMN IF EXISTS "categories_id";`);
}
