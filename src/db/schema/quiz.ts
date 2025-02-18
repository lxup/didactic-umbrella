import { check, index, integer, pgSchema, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

export const quizSchema = pgSchema("quiz");

export const answerTypeEnum = quizSchema.enum("answer_type", ["single_choice", "multiple_choice", "boolean", "text", "number"]);

export const quizzes = quizSchema.table("quizzes", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	iso_3166_1: varchar({ length: 2 }) // can be null, if provided, means the quiz is country-specific
}, (table) => [
	unique("quizzes_slug_unique").on(table.slug),
	index("quizzes_iso_3166_1_index").on(table.iso_3166_1)
]);

export const answerTypes = quizSchema.table("answer_types", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: text("name").notNull(),
	type: answerTypeEnum("type").notNull(),
});

export const answerChoices = quizSchema.table("answer_choices", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	answerTypeId: integer('answer_type_id').notNull().references(() => answerTypes.id, { onDelete: "cascade" }),
	choice: text("choice").notNull(),
}, (table) => [
	index("answer_choices_answer_type_id_index").on(table.answerTypeId),
	unique("answer_choices_answer_type_choice_unique").on(table.answerTypeId, table.choice)
]);

export const questions = quizSchema.table("questions", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	quizId: integer('quiz_id').notNull().references(() => quizzes.id, { onDelete: "cascade" }),
	answerTypeId: integer('answer_type_id').notNull().references(() => answerTypes.id, { onDelete: "cascade" }),
	order: integer().notNull().default(0),
}, (table) => [
	index("questions_quiz_id_index").on(table.quizId),
	index("questions_answer_type_id_index").on(table.answerTypeId),
	check("questions_order_check", sql`${table.order} >= 0`),
	unique("questions_quiz_order_unique").on(table.quizId, table.order)
]);

export const questionTranslations = quizSchema.table("question_translations", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	// locale: localesEnum().default("en").notNull(),
	locale: varchar({ length: 5 }).default("en").notNull(),
}, (table) => [
	index("question_translations_question_id_index").on(table.questionId),
	index("question_translations_locale_index").on(table.locale),
	unique("question_translations_locale_unique").on(table.questionId, table.locale)
]);

export const results = quizSchema.table("results", {
	id: uuid().primaryKey(),
	quizId: integer('quiz_id').notNull().references(() => quizzes.id, { onDelete: "cascade" }),
}, (table) => [
	index("results_quiz_id_index").on(table.quizId)
]);

export const resultAnswers = quizSchema.table("result_answers", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	resultId: uuid('result_id').notNull().references(() => results.id, { onDelete: "cascade" }),
	questionId: integer('question_id').notNull().references(() => questions.id, { onDelete: "cascade" }),
	answerChoiceId: integer('answer_choice_id').references(() => answerChoices.id, { onDelete: "set null" }),
	value: text("value"),
}, (table) => [
	index("result_answers_result_id_index").on(table.resultId),
	index("result_answers_question_id_index").on(table.questionId),
	index("result_answers_answer_choice_id_index").on(table.answerChoiceId)
]);