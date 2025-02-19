import { getQuizzes } from "@/actions/quiz/queries";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "@/lib/i18n/routing";
import getUnicodeFlagIcon from 'country-flag-icons/unicode'
import { getTranslations } from "next-intl/server";

const Home = async (
	props: {
        params: Promise<{
          locale: string;
          slug: string;
        }>;
    }
) => {
	const params = await props.params;
	const quizzes = await getQuizzes();
	const t = await getTranslations({ locale: params.locale, namespace: 'common' });
	return (
	<div className="@container/home flex flex-col items-center gap-2 p-2">
		<h1 className="text-4xl font-bold">Quizzes</h1>
		<div
		className={`
			grid max-w-4xl w-full gap-2
			grid-cols-1 @sm/home:grid-cols-2 @lg/home:grid-cols-3
		`}
		>
			{quizzes.map((quiz) => (
				<Card key={quiz.id}>
					<CardHeader>
						<CardTitle>{quiz.title}</CardTitle>
					</CardHeader>
					<CardContent>
						{quiz.iso_3166_1 ? (
							<div>
								{t('country')}: {getUnicodeFlagIcon(quiz.iso_3166_1)}
							</div>
						) : null}
					</CardContent>
					<CardFooter>
						<Button asChild>
							<Link href={`/quiz/${quiz.slug}`}>Commencer</Link>
						</Button>
					</CardFooter>
				</Card>
			))}
		</div>
	</div>
	);
};

export default Home;
  