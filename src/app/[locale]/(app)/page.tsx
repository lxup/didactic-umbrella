import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/routing";

const Home = async () => {
	

	return (
	<div className="flex flex-col items-center py-2">
		<h1>SALAM</h1>
		<Button asChild>
			<Link href="/quiz/hemicycle">Commencer</Link>
		</Button>
	</div>
	);
};

export default Home;
  