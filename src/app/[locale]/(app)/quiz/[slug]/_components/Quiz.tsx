'use client';

import AnswerChoices from "@/components/Quiz/AnswerChoices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import Icons from "@/constants/icons";
import { useQuiz } from "@/provider/quiz-provider";
import { type Quiz } from "@/types/type.db";
import { capitalize } from "lodash";
import { useEffect } from "react";

interface QuizProps extends React.HTMLAttributes<HTMLDivElement> {
	quiz: Quiz;
}

const Quiz = ({ quiz: initQuiz }: QuizProps) => {
	const {
		quiz: quiz,
		currentQuestionIndex,
		isFinished,
		isLoading,
		startQuiz,
		answerQuestion
	} = useQuiz();

	useEffect(() => {
		if (quiz?.id !== initQuiz.id) {
			startQuiz(initQuiz);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [initQuiz]);

	if (!quiz) {
		return null;
	}

	if (isLoading) return (
		<Icons.loader />
	);

	if (isFinished) return (
		<Icons.check />
	);

	const currentQuestion = quiz.questions![currentQuestionIndex];

	return (
		<div className="flex flex-col gap-2 max-w-xl w-full h-[50vh]">
			<div className="flex justify-between items-center gap-2">
				<h2 className="font-bold">Question {currentQuestionIndex + 1}</h2>
				<p className="text-xs font-semibold text-muted-foreground">{currentQuestionIndex} / {quiz.questions!.length}</p>
			</div>
			<Progress value={(currentQuestionIndex) * 100 / quiz.questions!.length} />
			<Card>
				{currentQuestion.theme ? <CardHeader>
					<CardTitle>{capitalize(currentQuestion.theme)}</CardTitle>
				</CardHeader> : null}
				<CardContent className={currentQuestion.theme ? 'pt-0' : 'pt-6'}>
					<p className="bg-muted rounded-md p-2">{currentQuestion.content}</p>
				</CardContent>
			</Card>
			<AnswerChoices
				answer={currentQuestion.answer}
				answerChoices={currentQuestion.answer.choices!}
				onAnswerSelect={async (answer) => await answerQuestion(currentQuestion.id, answer)}
			/>
		</div>
	);
};

export default Quiz;
