import { postgresAdapter } from "@payloadcms/db-postgres";

import { migrations } from "@/migrations";

export const postgresConfig = postgresAdapter({
	pool: {
		connectionString: process.env.DATABASE_URI,
	},
	prodMigrations: migrations,
});
