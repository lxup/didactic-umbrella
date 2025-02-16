type Question = {
	strKey: string;
}

type Quiz = {
	id: string;
	title: string;
	questions: Question[];
}

export default Quiz;