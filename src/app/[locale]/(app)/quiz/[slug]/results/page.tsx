const QuizResults = async (
	props: {
		searchParams?: Promise<{
			resultId: string | undefined;
		}>;
	}
) => {
	const searchParams = await props.searchParams;

	if (!searchParams?.resultId) {
		return (
		<div>
			No result found
		</div>
		);
	}
	return (
	<div>
		result bleeeeeehhh {searchParams.resultId}
	</div>
	)
};

export default QuizResults;