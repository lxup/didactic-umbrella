import { Db } from "@/db";
import quizzes from './data/quizzes.json';
import { inArray, sql } from "drizzle-orm";
import { question, questionTranslation, quiz } from "@/db/schema";

export default async function seed(db: Db) {
	await db
		.insert(quiz).values(quizzes.flatMap((quiz) => ({
			id: quiz.id,
			slug: quiz.slug,
			title: quiz.title,
			iso_3166_1: quiz.iso_3166_1
		})))
		.onConflictDoUpdate({
			target: [quiz.id],
			set: {
				title: sql.raw("excluded.title"),
				iso_3166_1: sql.raw("excluded.iso_3166_1")
			}
		})
		.returning({ id: quiz.id });
	
	const questionIds = await db
		.insert(question).values(quizzes.flatMap((quiz) => quiz.questions.map((question, index) => ({ quizId: quiz.id, answerId: question.answer_type_id, order: index }))))
		.onConflictDoUpdate({ target: [question.quizId, question.order], set: { answerId: sql.raw("excluded.answer_id") }})
		.returning({ id: question.id });
	await db.delete(questionTranslation).where(inArray(questionTranslation.questionId, questionIds.map(({ id }) => id)));
	await db.insert(questionTranslation)
		.values(quizzes.flatMap((quiz) => quiz.questions.flatMap((questionItem, index) => Object.entries(questionItem.translations).map(([locale, content]) => ({ questionId: sql`(SELECT id FROM ${question} WHERE quiz_id = ${quiz.id} AND "order" = ${index})`, content, locale })))))
		.onConflictDoUpdate({
			target: [questionTranslation.questionId, questionTranslation.locale],
			set: { content: sql.raw("excluded.content") },
		});
}