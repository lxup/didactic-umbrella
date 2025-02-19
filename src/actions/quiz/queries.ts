'use server';

import { site } from "@/constants/site";
import db from "@/db";
import { Quiz } from "@/types/type.db";
import { getLocale } from "next-intl/server";

const getQuizzes = async (): Promise<Quiz[]> => {
	return await db.query.quiz.findMany();
}

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

const getResultById = async (resultId: string) => {
	const locale = await getLocale();
	const result = await db.query.result
		.findFirst({
			where: (result, { eq }) => eq(result.id, resultId),
			with: {
				quiz: true,
				answers: {
					with: {
						question: {
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
								entityAnswers: {
									with: {
										entity: true
									}
								}
							}
						},
						answerChoice: {
							with: {
								resultAnswers: true
							}
						}
					}
				}
			}
		});
	return result ? {
		...result,
		answers: result.answers.map(({ question: { translations, ...question }, answerChoice, ...answer }) => ({
			...answer,
			question: {
				...question,
				content: translations[0].content
			},
			answerChoice: {
				...answerChoice,
			}
		}))
	} : null;
};

export {
	getQuizzes,
	getQuizBySlug,
	getResultById
}