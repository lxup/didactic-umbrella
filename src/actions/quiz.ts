"use server";

import db from "@/db";

const getQuizBySlug = async (slug: string) => {
	return await db.query.quiz
		.findFirst({
			where: (quiz, { eq }) => eq(quiz.slug, slug),
			with: {
				questions: {
					with: {
						translations: true
					}
				}
			}
		});
};

export {
	getQuizBySlug,
}