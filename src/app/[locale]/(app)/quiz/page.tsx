'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Voting from "@/components/Voting";
import { useQuiz } from "@/provider/quiz-provider";
import { useEffect } from "react";

const Quiz = () => {
	const { state, dispatch } = useQuiz();
	const currentQuestion = 1;
	const totalQuestions = 20;
	
	useEffect(() => {
		if (!state.activeQuiz) {
			dispatch({ type: "START_QUIZ", payload: { id: 1 } });
		}
	}, [state.activeQuiz, dispatch]);

	if (!state.activeQuiz) {
		return null;
	}
	return (
		<div className="flex-1 flex flex-col justify-center items-center px-4 py-2">
			<div className="flex flex-col gap-2 max-w-xl w-full h-[50vh]">
				<div className="flex justify-between items-center gap-2">
					<h2 className="font-bold">Question {state.activeQuiz.currentQuestionIndex + 1}</h2>
					<p className="text-xs font-semibold text-muted-foreground">{currentQuestion} / {totalQuestions}</p>
				</div>
				<Progress value={(currentQuestion - 1) * 100 / totalQuestions} />
				<Card>
					<CardHeader>
						<CardTitle>Economie</CardTitle>
					</CardHeader>
					<CardContent>
						<p className="bg-muted rounded-md p-2">
							ok
						</p>
					</CardContent>
				</Card>
				<Voting onVote={(vote) => console.log('you voted', vote)} />
			</div>
		</div>
	)
}

export default Quiz;