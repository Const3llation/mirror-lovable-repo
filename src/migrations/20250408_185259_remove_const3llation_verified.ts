import {
	type MigrateDownArgs,
	type MigrateUpArgs,
	sql,
} from "@payloadcms/db-postgres";

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
	await db.execute(sql`
   ALTER TABLE "service_providers" DROP COLUMN IF EXISTS "visibility_constellation_verified";
  DROP TYPE "public"."enum_service_providers_visibility_constellation_verified";`);
}

export async function down({
	db,
	payload,
	req,
}: MigrateDownArgs): Promise<void> {
	await db.execute(sql`
   CREATE TYPE "public"."enum_service_providers_visibility_constellation_verified" AS ENUM('Yes', 'No');
  ALTER TABLE "service_providers" ADD COLUMN "visibility_constellation_verified" "enum_service_providers_visibility_constellation_verified" DEFAULT 'No';`);
}
