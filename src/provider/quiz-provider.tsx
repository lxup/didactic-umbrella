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
	maxQuestionIndex: number;
	isFinished: boolean;
	isLoading: boolean;
	startQuiz: (quiz: Quiz) => void;
	answerQuestion: (questionId: number, answerId: number) => Promise<void>;
	resetQuiz: () => void;
	goToPreviousQuestion: () => void;
	goToNextQuestion: () => void;
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
	const [maxQuestionIndex, setMaxQuestionIndex] = useState(0);
	const [isFinished, setIsFinished] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const startQuiz = (quiz: Quiz) => {
		setQuiz(quiz);
		setAnswers([]);
		setCurrentQuestionIndex(0);
		setIsFinished(false);
	};

	const answerQuestion = async (questionId: number, answerId: number) => {
		setAnswers((prev) => {
			const existingIndex = prev.findIndex((a) => a.questionId === questionId);
			if (existingIndex !== -1) {
				const updatedAnswers = [...prev];
				updatedAnswers[existingIndex] = { questionId, answerChoiceId: answerId };
				return updatedAnswers;
			} else {
				return [...prev, { questionId, answerChoiceId: answerId }];
			}
		});
		goToNextQuestion();
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
			router.push(`/quiz/${quiz!.slug}/results/${resultId}`);
		} catch {

		} finally {
			resetQuiz();
		}
	}

	const goToPreviousQuestion = () => {
		setCurrentQuestionIndex((prevIndex) => Math.max(prevIndex - 1, 0));
	};
	
	const goToNextQuestion = () => {
		if (currentQuestionIndex >= quiz!.questions!.length - 1) {
			setIsFinished(true);
		} else {
			setCurrentQuestionIndex((prevIndex) => {
				const newIndex = prevIndex + 1;

				if (newIndex > maxQuestionIndex) {
					setMaxQuestionIndex(newIndex);
				}
				return newIndex;
			});
		}
	};

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
				maxQuestionIndex,
				isFinished,
				isLoading,
				startQuiz,
				answerQuestion,
				resetQuiz,
				goToPreviousQuestion,
				goToNextQuestion,
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