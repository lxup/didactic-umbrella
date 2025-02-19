import { Db } from "@/db";
import quizzes from './data/quizzes.json';
import { inArray, sql } from "drizzle-orm";
import { answerChoice, entity, entityAnswer, question, questionTranslation, quiz } from "@/db/schema";
import { Quiz } from "@/types/type.db";

export default async function seed(db: Db) {
	await db
		.insert(quiz).values(quizzes.flatMap((quiz) => ({
			id: quiz.id,
			slug: quiz.slug,
			title: quiz.title,
			image: quiz.image,
			iso_3166_1: quiz.iso_3166_1,
			type: quiz.type as Quiz['type']
		})))
		.onConflictDoUpdate({
			target: [quiz.id],
			set: {
				title: sql.raw("excluded.title"),
				iso_3166_1: sql.raw("excluded.iso_3166_1"),
				type: sql.raw("excluded.type")
			}
		})
		.returning({ id: quiz.id });
	
	const questionIds = await db
		.insert(question).values(quizzes.flatMap((quiz) => quiz.questions.map((question, index) => ({ quizId: quiz.id, answerId: question.answer_type_id, order: index, theme: question.theme }))))
		.onConflictDoUpdate({ target: [question.quizId, question.order], set: { answerId: sql.raw("excluded.answer_id"), theme: sql.raw("excluded.theme") } })
		.returning({ id: question.id, quizId: question.quizId, order: question.order });
	await db.delete(questionTranslation).where(inArray(questionTranslation.questionId, questionIds.map(({ id }) => id)));
	await db.insert(questionTranslation)
		.values(quizzes.flatMap((quiz) => quiz.questions.flatMap((questionItem, index) => Object.entries(questionItem.translations).map(([locale, content]) => ({ questionId: sql`(SELECT id FROM ${question} WHERE quiz_id = ${quiz.id} AND "order" = ${index})`, content, locale })))))
		.onConflictDoUpdate({
			target: [questionTranslation.questionId, questionTranslation.locale],
			set: { content: sql.raw("excluded.content") },
		});
	
	// Add entities
	const entities = await db.insert(entity)
		.values(
			quizzes.flatMap((quiz) => quiz.entities.map((e) => ({
				quizId: quiz.id,
				slug: e.slug,
				name: e.name,
				image: e.image
			})))
		)
		.onConflictDoUpdate({
			target: [entity.quizId, entity.slug],
			set: {
				name: sql.raw("excluded.name"),
				image: sql.raw("excluded.image"),
			}	
		})
		.returning({ id: entity.id, quizId: entity.quizId, slug: entity.slug });
	const entityAnswers = quizzes.flatMap((quiz) =>
		quiz.questions.flatMap((question, questionIndex) =>
			question.entitie_answers?.map((ea) => {
				const entity = entities.find((e) => e.slug === ea.entity_slug && e.quizId === quiz.id);
				const questionItem = questionIds.find((qi) => qi.quizId === quiz.id && qi.order === questionIndex);

				if (!entity?.id || !questionItem?.id) return null;

				return {
					entityId: entity.id,
					questionId: questionItem.id,
					answerChoiceId: sql`(SELECT id FROM ${answerChoice} WHERE choice = ${ea.answer} LIMIT 1)`
				};
			}).filter(Boolean)
		)
	).filter((ea) => !!ea);
	await db.insert(entityAnswer)
		.values(entityAnswers)
		.onConflictDoUpdate({
			target: [entityAnswer.entityId, entityAnswer.questionId],
			set: { answerChoiceId: sql.raw("excluded.answer_choice_id") }
		});
}