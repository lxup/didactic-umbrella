import { index, integer, pgEnum, pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { localesEnum } from "./config";

export const questionTypeEnum = pgEnum("question_type", ["single_choice", "multiple_choice", "text"]);

export const quizzes = pgTable("quizzes", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	title: text("title").notNull(),
	iso_3166_1: varchar({ length: 2 }) // can be null, if provided, means the quiz is country-specific
}, (table) => [
	index("quizzes_iso_3166_1_index").on(table.iso_3166_1)
]);

export const quizQuestions = pgTable("quiz_questions", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	quizId: integer('quiz_id').notNull().references(() => quizzes.id),
	questionType: questionTypeEnum('question_type').notNull(),
});

export const quizQuestionsStr = pgTable("quiz_questions_str", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	questionId: integer('question_id').notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	locale: localesEnum().default("en").notNull(),
}, (table) => [
	index("quiz_questions_str_question_id_index").on(table.questionId),
	index("quiz_questions_str_locale_index").on(table.locale),
	unique("quiz_questions_str_locale_unique").on(table.questionId, table.locale)
]);

export const quizAnswers = pgTable("quiz_answers", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	questionId: integer('question_id').notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
	choice: text("choice").notNull(),
	// dont know
}, (table) => [
	index("quiz_answers_question_id_index").on(table.questionId)
]);

export const quizResults = pgTable("quiz_results", {
	id: uuid().primaryKey(),
	quizId: integer('quiz_id').notNull().references(() => quizzes.id, { onDelete: "cascade" }),
}, (table) => [
	index("quiz_results_quiz_id_index").on(table.quizId)
]);

export const quizResultsAnswers = pgTable("quiz_results_answers", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	resultId: uuid('result_id').notNull().references(() => quizResults.id, { onDelete: "cascade" }),
	questionId: integer('question_id').notNull().references(() => quizQuestions.id, { onDelete: "cascade" }),
	answerId: integer('answer_id').notNull().references(() => quizAnswers.id, { onDelete: "cascade" }),
}, (table) => [
	index("quiz_results_answers_result_id_index").on(table.resultId),
	index("quiz_results_answers_question_id_index").on(table.questionId),
	index("quiz_results_answers_answer_id_index").on(table.answerId)
]);