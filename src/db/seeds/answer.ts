import { Db } from "../";
import answers from './data/answers.json';
import { and, inArray, notInArray, sql } from "drizzle-orm";
import { answerChoice, answer } from "../schema";

export default async function seed(db: Db) {
	await db
		.insert(answer)
		.values(
			answers.flatMap((answerItem) => ({
				id: answerItem.id,
				name: answerItem.name,
				type: answerItem.type as typeof answer.$inferInsert['type']
			}))
		)
		.onConflictDoUpdate({
			target: [answer.id],
			set: {
				name: sql.raw("excluded.name"),
				type: sql.raw("excluded.type")
			}
		});
	
	await db
		.insert(answerChoice)
		.values(answers.flatMap((answer) => answer.choices.map((choice) => ({
			answerId: answer.id,
			choice
		}))))
		.onConflictDoNothing();
	await db.delete(answerChoice).where(and(
		inArray(answerChoice.answerId, answers.map((answer) => answer.id)),
		notInArray(answerChoice.choice, answers.flatMap((answer) => answer.choices))
	));
}