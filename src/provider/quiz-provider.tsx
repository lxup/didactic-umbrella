"use client";

import { useRouter } from "@/lib/i18n/routing";
import { Quiz } from "@/types/type.db";
import React, { createContext, useContext, useState } from "react";

interface QuizContextProps {
	quiz: Quiz | null;
	answers: Record<number, number>; // questionId -> answerId
	currentQuestionIndex: number;
	isFinished: boolean;
	isLoading: boolean;
	startQuiz: (quiz: Quiz) => void;
	answerQuestion: (questionId: number, answerId: number) => Promise<void>;
	resetQuiz: () => void;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

interface QuizProviderProps {
	children: React.ReactNode;
}

const QuizProvider = ({ children }: QuizProviderProps) => {
	const router = useRouter();
	const [quiz, setQuiz] = useState<Quiz | null>(null);
	const [answers, setAnswers] = useState<Record<number, number>>({});
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const startQuiz = (quiz: Quiz) => {
		setQuiz(quiz);
		setAnswers({});
		setCurrentQuestionIndex(0);
		setIsFinished(false);
	};

	const answerQuestion = async (questionId: number, answerId: number) => {
		setAnswers((prev) => ({ ...prev, [questionId]: answerId }));
		if (currentQuestionIndex >= quiz!.questions.length - 1) {
			await finishQuiz();
		} else {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		}
	};

	const resetQuiz = () => {
		setQuiz(null);
		setAnswers({});
		setCurrentQuestionIndex(0);
		setIsFinished(false);
		setIsLoading(false);
	};

	const finishQuiz = async () => {
		setIsFinished(true);
		setIsLoading(true);
		const resultId = 1;
		// Save answers to the server
		// await saveAnswers(answers);
		router.push(`/quiz/${quiz!.slug}/results?resultId=${resultId}`);
		resetQuiz();
	}

	// console.log(`
	// quiz: ${quiz?.id ?? null},
	// currentQuestionIndex: ${currentQuestionIndex},
	// isFinished: ${isFinished},
	// isLoading: ${isLoading},
	// `)

	return (
		<QuizContext.Provider
			value={{
				quiz,
				answers,
				currentQuestionIndex,
				isFinished,
				isLoading,
				startQuiz,
				answerQuestion,
				resetQuiz,
			}}
		>
			{children}
		</QuizContext.Provider>
	);
};

const useQuiz = () => {
	const context = useContext(QuizContext);
	if (!context) throw new Error("useQuiz must be used within a QuizProvider");
	return context;
};

export { QuizProvider, useQuiz };