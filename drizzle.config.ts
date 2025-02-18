import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

export const DATABASE_URL = process.env.DATABASE_URL!;

export default defineConfig({
	out: './drizzle',
	dialect: 'postgresql',
	schema: './src/db/schema',
	schemaFilter: ['public', 'quiz'],
	dbCredentials: {
		url: DATABASE_URL,
	},
});