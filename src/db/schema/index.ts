import { check, index, integer, pgEnum, pgTable, text, unique, uuid, varchar } from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

export const answerTypeEnum = pgEnum("answer_type", ["single_choice", "multiple_choice", "boolean", "text", "number"]);
export const resultsTypeEnum = pgEnum("results_type", ["match_based", "score_based"]);

export const quiz = pgTable("quiz", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	slug: text("slug").notNull(),
	title: text("title").notNull(),
	image: text("image"),
	iso_3166_1: varchar({ length: 2 }), // can be null, if provided, means the quiz is country-specific
	type: resultsTypeEnum("type").notNull().default("score_based"),
}, (table) => [
	unique("quiz_slug_unique").on(table.slug),
	index("quiz_iso_3166_1_index").on(table.iso_3166_1),
	index("quiz_type_index").on(table.type)
]);

export const quizRelations = relations(quiz, ({ many }) => ({
	questions: many(question),
}));

export const answer = pgTable("answer", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	name: text("name").notNull(),
	type: answerTypeEnum("type").notNull(),
});

export const answerRelations = relations(answer, ({ many }) => ({
	choices: many(answerChoice),
	questions: many(question),
}));

export const answerChoice = pgTable("answer_choice", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	answerId: integer('answer_id').notNull().references(() => answer.id, { onDelete: "cascade" }),
	choice: text("choice").notNull(),
}, (table) => [
	index("answer_choice_answer_id_index").on(table.answerId),
	unique("answer_choice_answer_choice_unique").on(table.answerId, table.choice)
]);

export const answerChoiceRelations = relations(answerChoice, ({ one, many }) => ({
	answer: one(answer, { fields: [answerChoice.answerId], references: [answer.id] }),
	resultAnswers: many(resultAnswer),
	// results: many(resultAnswer),
}));

export const question = pgTable("question", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	quizId: integer('quiz_id').notNull().references(() => quiz.id, { onDelete: "cascade" }),
	answerId: integer('answer_id').notNull().references(() => answer.id, { onDelete: "cascade" }),
	order: integer().notNull().default(0),
	theme: text("theme"),
}, (table) => [
	index("question_quiz_id_index").on(table.quizId),
	index("question_answer_id_index").on(table.answerId),
	check("question_order_check", sql`${table.order} >= 0`),
	unique("question_quiz_order_unique").on(table.quizId, table.order)
]);

export const questionRelations = relations(question, ({ one, many }) => ({
	quiz: one(quiz, { fields: [question.quizId], references: [quiz.id] }),
	answer: one(answer, { fields: [question.answerId], references: [answer.id] }),
	entityAnswers: many(entityAnswer),
	translations: many(questionTranslation),
}));

export const questionTranslation = pgTable("question_translation", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	questionId: integer('question_id').notNull().references(() => question.id, { onDelete: "cascade" }),
	content: text("content").notNull(),
	locale: varchar({ length: 5 }).default("en").notNull(),
}, (table) => [
	index("question_translation_question_id_index").on(table.questionId),
	index("question_translation_locale_index").on(table.locale),
	unique("question_translation_locale_unique").on(table.questionId, table.locale)
]);

export const questionTranslationRelations = relations(questionTranslation, ({ one }) => ({
	question: one(question, { fields: [questionTranslation.questionId], references: [question.id] })
}));

export const result = pgTable("result", {
	id: uuid().primaryKey().defaultRandom(),
	quizId: integer('quiz_id').notNull().references(() => quiz.id, { onDelete: "cascade" }),
}, (table) => [
	index("result_quiz_id_index").on(table.quizId)
]);

export const resultRelations = relations(result, ({ one, many }) => ({
	quiz: one(quiz, { fields: [result.quizId], references: [quiz.id] }),
	answers: many(resultAnswer),
}));

export const resultAnswer = pgTable("result_answer", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	resultId: uuid('result_id').notNull().references(() => result.id, { onDelete: "cascade" }),
	questionId: integer('question_id').notNull().references(() => question.id, { onDelete: "cascade" }),
	answerChoiceId: integer('answer_choice_id').references(() => answerChoice.id, { onDelete: "set null" }),
	value: text("value"),
}, (table) => [
	index("result_answer_result_id_index").on(table.resultId),
	index("result_answer_question_id_index").on(table.questionId),
	index("result_answer_answer_choice_id_index").on(table.answerChoiceId),
	check("result_answer_value_check", sql`${table.answerChoiceId} IS NOT NULL OR ${table.value} IS NOT NULL`),
	unique("result_answer_result_question_unique").on(table.resultId, table.questionId)
]);

export const resultAnswerRelations = relations(resultAnswer, ({ one }) => ({
	result: one(result, { fields: [resultAnswer.resultId], references: [result.id] }),
	question: one(question, { fields: [resultAnswer.questionId], references: [question.id] }),
	answerChoice: one(answerChoice, { fields: [resultAnswer.answerChoiceId], references: [answerChoice.id] })
}));

export const entity = pgTable("entity", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	quizId: integer('quiz_id').notNull().references(() => quiz.id, { onDelete: "cascade" }),
	slug: text("slug").notNull(),
	name: text("name").notNull(),
	image: text("image"),
}, (table) => [
	unique("entity_quiz_slug_unique").on(table.quizId, table.slug),
	index("entity_quiz_id_index").on(table.quizId),
	index("entity_slug_index").on(table.slug),
]);

export const entityRelations = relations(entity, ({ one, many }) => ({
	quiz: one(quiz, { fields: [entity.quizId], references: [quiz.id] }),
	answers: many(entityAnswer),
}));

export const entityAnswer = pgTable("entity_answer", {
	id: integer().primaryKey().generatedByDefaultAsIdentity(),
	entityId: integer('entity_id').notNull().references(() => entity.id, { onDelete: "cascade" }),
	questionId: integer('question_id').notNull().references(() => question.id, { onDelete: "cascade" }),
	answerChoiceId: integer('answer_choice_id').references(() => answerChoice.id, { onDelete: "set null" }),
	value: text("value"),
}, (table) => [
	index("entity_answer_entity_id_index").on(table.entityId),
	index("entity_answer_question_id_index").on(table.questionId),
	index("entity_answer_answer_choice_id_index").on(table.answerChoiceId),
	check("entity_answer_value_check", sql`${table.answerChoiceId} IS NOT NULL OR ${table.value} IS NOT NULL`),
	unique("entity_answer_entity_question_unique").on(table.entityId, table.questionId)
]);

export const entityAnswerRelations = relations(entityAnswer, ({ one }) => ({
	entity: one(entity, { fields: [entityAnswer.entityId], references: [entity.id] }),
	question: one(question, { fields: [entityAnswer.questionId], references: [question.id] }),
	answerChoice: one(answerChoice, { fields: [entityAnswer.answerChoiceId], references: [answerChoice.id] })
}));