import { Button } from "@/components/ui/button";
import { Link } from "@/lib/i18n/routing";

export default function Home() {
	return (
	<div className="flex flex-col items-center py-2">
		<h1>SALAM</h1>
		<Button asChild>
			<Link href="/quiz">Commencer</Link>
		</Button>
	</div>
	);
}
  