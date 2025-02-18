import { getQuizBySlug } from "@/actions/quiz";
import { notFound } from "next/navigation";

const QuizPage = async (
	props: {
        params: Promise<{
          locale: string;
          slug: string;
        }>;
    }
) => {
	const { slug } = await props.params;
	const quiz = await getQuizBySlug(slug);
	if (!quiz) notFound();
	console.log(quiz);
	return (
		<div>
			{slug}
			{JSON.stringify(quiz)}
		</div>
	)

};

export default QuizPage;