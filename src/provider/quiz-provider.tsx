"use client";

import React, { createContext, useReducer, useContext } from "react";

interface QuizProgress {
	id: number;
	currentQuestionIndex: number;
	answers: Record<number, string>; // Clé = question ID, valeur = réponse
}

interface QuizState {
	activeQuiz: QuizProgress | null;
}

type QuizAction =
	| { type: "START_QUIZ"; payload: { id: number } }
	| { type: "ANSWER_QUESTION"; payload: { questionId: number; answer: string; } }
	| { type: "RESET_QUIZ" };

const quizReducer = (state: QuizState, action: QuizAction): QuizState => {
	switch (action.type) {
		case "START_QUIZ":
			return {
				activeQuiz: {
					id: action.payload.id,
					currentQuestionIndex: 0,
					answers: {},
				},
			};
		case "ANSWER_QUESTION":
			if (!state.activeQuiz) return state;
			const { questionId, answer } = action.payload;
			return {
				activeQuiz: {
					...state.activeQuiz,
					currentQuestionIndex: state.activeQuiz.currentQuestionIndex + 1,
					answers: { ...state.activeQuiz.answers, [questionId]: answer },
				},
			};
		case "RESET_QUIZ":
			return { activeQuiz: null };
		default:
			return state;
	}
};

interface QuizContextProps {
	state: QuizState;
	dispatch: React.Dispatch<QuizAction>;
}

const QuizContext = createContext<QuizContextProps | undefined>(undefined);

const QuizProvider = ({ children }: { children: React.ReactNode }) => {
	const [state, dispatch] = useReducer(quizReducer, { activeQuiz: null });

	return (
		<QuizContext.Provider value={{ state, dispatch }}>
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
