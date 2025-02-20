import { getResultById } from "@/actions/quiz/queries";

const generateMatchBasedResultsImage = (result: NonNullable<Awaited<ReturnType<typeof getResultById>>>) => {
	return result
};

export default generateMatchBasedResultsImage;