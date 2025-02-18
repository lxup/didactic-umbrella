"use server";

import { site } from "@/constants/site";
import db from "@/db";
import { Quiz } from "@/types/type.db";
import { getLocale } from "next-intl/server";

const getQuizBySlug = async (slug: string): Promise<Quiz | null> => {
	const locale = await getLocale();
	const quiz = await db.query.quiz
		.findFirst({
			where: (quiz, { eq }) => eq(quiz.slug, slug),
			with: {
				questions: {
					with: {
						translations: {
							where: (questionTranslation, { eq, or }) => or(
								eq(questionTranslation.locale, locale),
								locale !== site.defaultLocale ? eq(questionTranslation.locale, site.defaultLocale) : undefined
							),
							orderBy: (questionTranslation, { desc, sql }) => [
								desc(sql`${questionTranslation.locale} = ${locale}`),
								desc(sql`${questionTranslation.locale} = ${site.defaultLocale}`)
							]
						},
						answer: {
							with: {
								choices: true,
							}
						}
					}
				}
			}
		});
	return quiz ? {
		...quiz,
		questions: quiz.questions.map(({ translations, ...question}) => ({
			...question,
			content: translations[0].content
		}))
	} : null;
};

export {
	getQuizBySlug,
}