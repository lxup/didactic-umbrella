import { getQuizBySlug } from "@/actions/quiz/queries";
import { notFound } from "next/navigation";
import Quiz from "../../../../../components/Quiz/Quiz";

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
	return (
		<div className="flex-1 flex flex-col justify-center items-center px-4 py-2">
			<Quiz quiz={quiz} />
		</div>
	)

};

export default QuizPage;