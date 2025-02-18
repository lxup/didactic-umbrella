import { getResultById } from "@/actions/quiz/queries";
import { z } from "zod";

const searchParamsSchema = z.object({
	resultId: z.preprocess(
		(value) => value?.toString(),
		z.string().uuid()
	),
});
const QuizResults = async (
	props: {
		searchParams?: Promise<{
			resultId: string | undefined;
		}>;
	}
) => {
	const searchParams = searchParamsSchema.safeParse(await props.searchParams);
	const result = searchParams.success ? await getResultById(searchParams.data.resultId!) : null;

	if (!result) {
		return (
		<div>
			No result found
		</div>
		);
	}

	
	return (
	<div>
		result bleeeeeehhh {result.id}
		{JSON.stringify(result)}
	</div>
	)
};

export default QuizResults;