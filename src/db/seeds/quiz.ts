import { Db } from "@/db";
import quizzes from './data/quizzes.json';
import { answerChoices, answerTypes, questions, questionTranslations, quizzes } from "@/db/schema/quiz";
import { and, inArray, notInArray, sql } from "drizzle-orm";

export default async function seed(db: Db) {
	await db.insert(answerTypes).values(AnswerTypes.flatMap((answerType) => ({ id: answerType.id, name: answerType.name, type: answerType.type }))).onConflictDoUpdate({ target: [answerTypes.id], set: { name: sql.raw("excluded.name"), type: sql.raw("excluded.type") }});
	await db.insert(answerChoices).values(AnswerTypes.flatMap((answerType) => answerType.choices.map((choice) => ({ answerTypeId: answerType.id, choice })))).onConflictDoNothing();
	await db.delete(answerChoices).where(and(
		inArray(answerChoices.answerTypeId, AnswerTypes.map((answerType) => answerType.id)),
		notInArray(answerChoices.choice, AnswerTypes.flatMap((answerType) => answerType.choices))
	));

	// Add quizzes
	await db
		.insert(quizzes).values(Quizzes.flatMap((quiz) => ({ id: quiz.id, slug: quiz.slug, title: quiz.title, iso_3166_1: quiz.iso_3166_1 })))
		.onConflictDoUpdate({ target: [quizzes.id], set: { title: sql.raw("excluded.title"), iso_3166_1: sql.raw("excluded.iso_3166_1") }})
		.returning({ id: quizzes.id });
	
	// Add questions
	const questionIds = await db
		.insert(questions).values(Quizzes.flatMap((quiz) => quiz.questions.map((question, index) => ({ quizId: quiz.id, answerTypeId: question.answerTypeId, order: index }))))
		.onConflictDoUpdate({ target: [questions.quizId, questions.order], set: { answerTypeId: sql.raw("excluded.answer_type_id") }})
		.returning({ id: questions.id });
	// Add question translations
	await db.delete(questionTranslations).where(inArray(questionTranslations.questionId, questionIds.map(({ id }) => id)));
	await db.insert(questionTranslations)
		.values(Quizzes.flatMap((quiz) => quiz.questions.flatMap((question, index) => Object.entries(question.translations).map(([locale, content]) => ({ questionId: sql`(SELECT id FROM ${questions} WHERE quiz_id = ${quiz.id} AND "order" = ${index})`, content, locale })))))
		.onConflictDoUpdate({
			target: [questionTranslations.questionId, questionTranslations.locale],
			set: { content: sql.raw("excluded.content") },
		});
}