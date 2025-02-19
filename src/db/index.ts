import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '../../drizzle.config';
import * as schema from './schema';

const db = drizzle(DATABASE_URL, {
	schema,
	// logger: true,
});

export type Db = typeof db;

export default db;