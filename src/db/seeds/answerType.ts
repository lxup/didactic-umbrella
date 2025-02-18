const answerTypes = [
	{
		id: 1,
		name: "Vote",
		type: "single_choice" as const,
		choices: ["for", "against"],
	},
];

export default answerTypes;