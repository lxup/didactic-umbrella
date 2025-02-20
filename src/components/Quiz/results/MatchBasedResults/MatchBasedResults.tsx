import { getResultById } from "@/actions/quiz/queries";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import { cn } from "@/lib/utils";
import { forwardRef } from "react";
import { entity } from '@/db/schema';
import { upperCase } from 'lodash';

interface MatchBasedResultsProps
	extends React.ComponentProps<'ul'> {
		result: NonNullable<Awaited<ReturnType<typeof getResultById>>>;
	}


const MatchBasedResults = forwardRef<
	HTMLUListElement,
	MatchBasedResultsProps
>(({ result, className, ...props }, ref) => {
	const entityResults = result.answers
		.flatMap((answer) =>
			answer.question.entityAnswers.map((entityAnswer) => ({
				entity: entityAnswer.entity,
				isMatching: answer.answerChoiceId === entityAnswer.answerChoiceId,
			}))
		)
		.reduce((acc, { entity, isMatching }) => {
			let entityData = acc.find((e) => e.entity.id === entity.id);

			if (!entityData) {
				entityData = {
					entity,
					matchingAnswers: 0,
					totalAnswers: 0,
				};
				acc.push(entityData);
			}

			entityData.totalAnswers++;
			if (isMatching) entityData.matchingAnswers++;

			return acc;
		}, [] as { entity: typeof entity.$inferSelect; matchingAnswers: number; totalAnswers: number }[])

		.map(({ entity, matchingAnswers, totalAnswers }) => ({
			entity,
			percentage: totalAnswers > 0 ? Math.round((matchingAnswers / totalAnswers) * 100) : 0,
		}))
		.sort((a, b) => b.percentage - a.percentage);
	return (
		<ul
		ref={ref}
		className={cn('space-y-2', className)}
		{...props}
		>
			{entityResults.map(({ entity, percentage }) => (
				<li key={entity.id} className="p-3 border rounded-lg flex justify-between items-center">
					<div className="flex items-center gap-2">
						<div className="aspect-square relative w-10">
							<ImageWithFallback type="alt" src={entity.image ?? ''} alt={upperCase(entity.slug)} fill />
						</div>
						<span className="line-clamp-1">{entity.name} ({upperCase(entity.slug)})</span>
					</div>
					<span className="font-bold">{percentage}%</span>
				</li>
			))}
		</ul>
	);
});
MatchBasedResults.displayName = "MatchBasedResults";

export default MatchBasedResults;
