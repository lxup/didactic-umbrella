import { Button } from "../ui/button";
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
		className={cn('flex justify-center gap-2', className)}
		>
			<Button variant={'success'} className={cn('w-full')} onClick={() => onAnswerSelect(answerChoices.find((answerChoice) => answerChoice.choice === "for")!.id)}>👍</Button>
			<Button variant={'secondary'} className={cn('')} onClick={() => onAnswerSelect(answerChoices.find((answerChoice) => answerChoice.choice === "abstain")!.id)}>🤷</Button>
			<Button variant={'destructive'} className={cn('w-full')} onClick={() => onAnswerSelect(answerChoices.find((answerChoice) => answerChoice.choice === "against")!.id)}>👎</Button>
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