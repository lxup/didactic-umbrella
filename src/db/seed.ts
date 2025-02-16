import { Pool } from "pg";
import { DATABASE_URL } from "../../drizzle.config";
import { drizzle } from "drizzle-orm/node-postgres";
import { sql } from "drizzle-orm";
import Schema from "./schema";

const main = async () => {
	const client = new Pool({
		connectionString: DATABASE_URL,
	});
	const db = drizzle(client);

	console.log("Seeding started");
	// Add quizzes
	await db
		.insert(Schema.quizzes).values({
			id: 1,
			title: "Hemicycle Quiz"
		})
		.onConflictDoUpdate({
			target: [Schema.quizzes.id],
			set: {
				title: sql.raw("excluded.title"),
			}
		})
};

main().then(() => {
	console.log("Seeding completed");
	process.exit(0);
}).catch((error) => {
	console.error("Seeding failed");
	console.error(error);
	process.exit(1);
});
