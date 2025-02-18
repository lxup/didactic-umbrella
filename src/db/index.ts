import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '../../drizzle.config';
import schema from './schema';
// import * as configSchema from './schema/config';
// import * as quizSchema from './schema/quiz';

const db = drizzle(DATABASE_URL, {
	schema,
	// schema: {
	// 	...configSchema,
	// 	...quizSchema,
	// }
});

export type Db = typeof db;

export default db;