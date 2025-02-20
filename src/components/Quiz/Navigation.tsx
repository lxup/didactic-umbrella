import { cn } from "@/lib/utils";
import { useQuiz } from "@/provider/quiz-provider";
import { Button } from "@/components/ui/button";
import Icons from "@/constants/icons";
import { useTranslations } from "next-intl";

export interface NavigationProps {
	className?: string;
}
const Navigation = ({
	className
} : NavigationProps) => {
	const t = useTranslations('common');
	const {
		currentQuestionIndex,
		maxQuestionIndex,
		goToPreviousQuestion,
		goToNextQuestion,
	} = useQuiz();
	return (
		<div className={cn('flex items-center justify-between gap-2', className)}>
			<Button
			variant={'ghost'}
			size={'sm'}
			disabled={currentQuestionIndex <= 0}
			onClick={goToPreviousQuestion}
			>
				<Icons.previous />
				{t('previous')}
			</Button>
			<Button
			variant={'ghost'}
			size={'sm'}
			disabled={currentQuestionIndex >= maxQuestionIndex}
			onClick={goToNextQuestion}
			>
				{t('next')}
				<Icons.next />
			</Button>
		</div>
	)
};

export default Navigation;