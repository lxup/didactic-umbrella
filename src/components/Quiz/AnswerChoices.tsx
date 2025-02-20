import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Answer, AnswerChoice } from "@/types/type.db";

interface AnswerChoicesProps extends React.HTMLAttributes<HTMLDivElement> {
	answer: Answer
	answerChoices: AnswerChoice[];
	onAnswerSelect: (answerId: number) => void;
};

const AnswerChoices = ({
	answer,
	answerChoices,
	onAnswerSelect,
	className,
} : AnswerChoicesProps) => {
	if (answer.id == 1) {
		return (
		<div
		className={cn('grid grid-cols-1 @lg/quiz:grid-cols-3 gap-2', className)}
		>
			<Button variant={'success'} className={cn('')} onClick={() => onAnswerSelect(answerChoices.find((answerChoice) => answerChoice.choice === "for")!.id)}>
				👍
				Pour
			</Button>
			<Button variant={'secondary'} className={cn('')} onClick={() => onAnswerSelect(answerChoices.find((answerChoice) => answerChoice.choice === "abstain")!.id)}>
				🤷
				Abstention
			</Button>
			<Button variant={'destructive'} className={cn('')} onClick={() => onAnswerSelect(answerChoices.find((answerChoice) => answerChoice.choice === "against")!.id)}>
				👎
				Contre
			</Button>
		</div>
		);
	}
	return null;
	// switch (answerType) {
	// 	case "single_choice":
	// 		break;
	// 	default:
	// 		break;
	// }
};

export default AnswerChoices;