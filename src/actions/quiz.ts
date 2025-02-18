import db from "@/db";
import { questions, questionTranslations, quizzes } from "@/db/schema/quiz";
import { eq } from "drizzle-orm";

const getQuizBySlug = async (slug: string) => {
	// const [quiz] = await db
	// 	.select()
	// 	.from(quizzes)
	// 	.leftJoin(questions, eq(questions.quizId, quizzes.id))
	// 	.leftJoin(questionTranslations, eq(questionTranslations.questionId, questions.id))
	// 	.where(eq(quizzes.slug, slug))
	// 	.groupBy((t) => [t.quizzes.id, t.questions.id, t.question_translations.id])
	// 	.limit(1);
	const quiz = await db.query.quizzes
		.findFirst({
			where: (quiz, { eq }) => eq(quiz.id, 1),
		});
	return quiz ?? null;
};

export {
	getQuizBySlug,
}