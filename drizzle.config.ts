import type { Config } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

export default {
	schema: './src/lib/schema.ts',
	out: './src/lib/server/drizzle',
	dbCredentials: {
		uri: process.env.DATABASE_URL!
	},
	driver: 'mysql2'
} satisfies Config;
