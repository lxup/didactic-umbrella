import { getResultById } from "@/actions/quiz/queries";
import { getTranslations } from "next-intl/server";
import { z } from "zod";
import MatchBasedResults from "./_components/MatchBasedResults";
import ShareResults from "./_components/ShareResults";

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
	const t = await getTranslations({ locale: params.locale, namespace: 'common' });
	const { success, data } = paramsSchema.safeParse({ resultId: params.result_id });
	const result = success ? await getResultById(data.resultId!) : null;

	if (!result) {
		return (
		<div>
			No result found
		</div>
		);
	}
	const render = result.quiz.type === "match_based"
		? <MatchBasedResults result={result} />
		: <div>Unsupported now</div>;

	return (
		<div className="flex flex-col gap-4 items-center p-4">
			<div id={`quiz-results-${result.id}`} className="flex flex-col items-center gap-2 max-w-xl w-full">
				<h1 className="text-4xl font-bold text-center">{t('results')}</h1>
				<div className="w-full">
				{render}
				</div>
			</div>
			<ShareResults result={result} className="p-2" />
		</div>
	)
};

export default QuizResults;