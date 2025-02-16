import 'dotenv/config';
import { drizzle } from 'drizzle-orm/node-postgres';
import { DATABASE_URL } from '../../drizzle.config';
import * as schema from './schema/config';

const db = drizzle(DATABASE_URL, { schema });

export default db;