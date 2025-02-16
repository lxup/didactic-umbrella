import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export const DATABASE_URL = process.env.POSTGRES_URL!;

export default defineConfig({
	out: './drizzle',
	dialect: 'postgresql',
	schema: './src/db/schema',
	dbCredentials: {
		url: DATABASE_URL,
	},
});