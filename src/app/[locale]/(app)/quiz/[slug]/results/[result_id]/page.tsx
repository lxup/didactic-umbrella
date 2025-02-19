import { getResultById } from "@/actions/quiz/queries";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import MatchBasedResults from "./_components/MatchBasedResults";

export async function generateMetadata(
    props: {
        params: Promise<{
          locale: string;
        }>;
    }
) {
    const params = await props.params;
    const common = await getTranslations({ locale: params.locale, namespace: 'pages.quiz.results' });
    return {
		title: common('meta.title'),
		description: common('meta.description'),
	};
}

const paramsSchema = z.object({
	resultId: z.preprocess(
		(value) => value?.toString(),
		z.string().uuid()
	),
});
const QuizResults = async (
	props: {
		params: Promise<{
			locale: string;
			slug: string;
			result_id: string;
		}>;
	}
) => {
	const params = await props.params;
	const { success, data } = paramsSchema.safeParse({ resultId: params.result_id });
	const result = success ? await getResultById(data.resultId!) : null;

	if (!result) {
		return (
		<div>
			No result found
		</div>
		);
	}

	switch (result.quiz.type) {
		case "match_based":
			return (
				<MatchBasedResults result={result} />
			);
		default:
			return (
				<div>Unsupported now</div>
			)
	}
};

export default QuizResults;