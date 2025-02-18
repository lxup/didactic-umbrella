import { Db } from "@/db";
import answers from './data/answers.json';
import { and, inArray, notInArray, sql } from "drizzle-orm";
import { answerChoice, answer } from "@/db/schema";

export default async function seed(db: Db) {
	await db
		.insert(answer)
		.values(
			answers.flatMap((answer) => ({
				id: answer.id,
				name: answer.name,
				type: answer.type
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