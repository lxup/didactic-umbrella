import { getTranslations } from "next-intl/server";

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

const ResultsPage = () => {
	return (
		<div>
			Results are here
		</div>
	)
};

export default ResultsPage;