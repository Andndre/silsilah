import dotenv from 'dotenv';
import type { Config } from 'drizzle-kit';

dotenv.config();

export default {
	schema: './src/lib/schema.ts',
	out: './src/lib/server/drizzle',
	dbCredentials: {
		uri: process.env.DATABASE_URL!,
	},
	driver: 'mysql2',
} satisfies Config;
