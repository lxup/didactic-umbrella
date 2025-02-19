import { getResultById } from "@/actions/quiz/queries";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";

interface MatchBasedResultsProps
	extends React.ComponentProps<'div'> {
		result: NonNullable<Awaited<ReturnType<typeof getResultById>>>;
	}


const MatchBasedResults = forwardRef<
	HTMLDivElement,
	MatchBasedResultsProps
>(({ result, className, ...props }, ref) => {
	const entityStats = new Map();

	result.answers.forEach((answer) => {
		answer.question.entityAnswers.forEach((entityAnswer) => {
			const entityId = entityAnswer.entity.id;
			if (!entityStats.has(entityId)) {
				entityStats.set(entityId, {
					entity: entityAnswer.entity,
					matchingAnswers: 0,
					totalAnswers: 0,
				});
			}

			const entityData = entityStats.get(entityId);
			entityData.totalAnswers++;

			if (answer.answerChoiceId === entityAnswer.answerChoiceId) {
				entityData.matchingAnswers++;
			}
		});
	});

	const entityResults = Array.from(entityStats.values())
		.map(({ entity, matchingAnswers, totalAnswers }) => ({
			entity,
			percentage: totalAnswers > 0 ? Math.round((matchingAnswers / totalAnswers) * 100) : 0,
		}))
		.sort((a, b) => b.percentage - a.percentage);

	return (
		<div
			ref={ref}
			className={cn('p-4', className)}
			{...props}
		>
			<h2 className="text-xl font-bold mb-4">Votre correspondance</h2>
			<ul className="space-y-3">
				{entityResults.map(({ entity, percentage }) => (
					<li key={entity.id} className="p-3 border rounded-lg flex justify-between">
						<span>{entity.name}</span>
						<span className="font-bold">{percentage}%</span>
					</li>
				))}
			</ul>
		</div>
	);
});
MatchBasedResults.displayName = "MatchBasedResults";

export default MatchBasedResults;
