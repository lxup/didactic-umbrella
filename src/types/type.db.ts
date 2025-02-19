import { answer, answerChoice, question, quiz } from "@/db/schema";

export type AnswerChoice = typeof answerChoice.$inferSelect & {
}

export type Answer = typeof answer.$inferSelect & {
	choices?: AnswerChoice[];
}

export type Question = typeof question.$inferSelect & {
	content: string;
	answer: Answer;
}

export type Quiz = typeof quiz.$inferSelect & {
	questions?: Question[];
}