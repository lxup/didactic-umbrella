"use client";

import { saveQuizResult } from "@/actions/quiz/mutations";
import { useRouter } from "@/lib/i18n/routing";
import { Quiz } from "@/types/type.db";
import React, { createContext, useContext, useEffect, useState } from "react";

interface QuizContextProps {
	quiz: Quiz | null;
	answers: {
		questionId: number;
		answerChoiceId: number;
	}[],
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
	const [answers, setAnswers] = useState<{
		questionId: number;
		answerChoiceId: number;
	}[]>([]);
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const startQuiz = (quiz: Quiz) => {
		setQuiz(quiz);
		setAnswers([]);
		setCurrentQuestionIndex(0);
		setIsFinished(false);
	};

	const answerQuestion = async (questionId: number, answerId: number) => {
		setAnswers((prev) => [...prev, { questionId, answerChoiceId: answerId }]);
		if (currentQuestionIndex >= quiz!.questions.length - 1) {
			setIsFinished(true);
		} else {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
		}
	};

	const resetQuiz = () => {
		setQuiz(null);
		setAnswers([]);
		setCurrentQuestionIndex(0);
		setIsFinished(false);
		setIsLoading(false);
	};

	const finishQuiz = async () => {
		if (!quiz) return;
		try {
			setIsLoading(true);
			const resultId = await saveQuizResult({
				quizId: quiz.id,
				answers: answers,
			})
			router.push(`/quiz/${quiz!.slug}/results?resultId=${resultId}`);
		} catch {

		} finally {
			resetQuiz();
		}
	}

	useEffect(() => {
		if (isFinished) {
			finishQuiz();
		}
	}, [isFinished]);

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