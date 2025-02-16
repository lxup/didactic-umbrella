import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Link } from "@/lib/i18n/routing";
import { site } from "@/constants/site";

const Header = ({
	className,	
} : {
	className?: string;
}) => {
	return (
		<header className={cn("flex justify-between items-center w-full p-2", className)}>
			<Link href={'/'}><h1>{site.title}</h1></Link>
			<ThemeToggle />
		</header>
	)
};

export default Header;