'use server';

import db from "@/db";
import { result, resultAnswer } from "@/db/schema";

/**
 * Save the results of a quiz
 * @param quizId The ID of the quiz
 * @param answers The answers to the quiz questions
 */
const saveQuizResult = async ({
	quizId,
	answers,
} : {
	quizId: number,
	answers: {
		questionId: number,
		answerChoiceId: number,
	}[],
}) => {
	const [{ id }] = await db
		.insert(result)
		.values({
			quizId: quizId,
		})
		.returning({ id: result.id });
	await db
		.insert(resultAnswer)
		.values(answers.map(({ questionId, answerChoiceId }) => ({
			resultId: id,
			questionId: questionId,
			answerChoiceId: answerChoiceId,
		})));
	return id;
};

export {
	saveQuizResult,
}