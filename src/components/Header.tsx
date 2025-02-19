import { cn } from "@/lib/utils";
import ThemeToggle from "./ThemeToggle";
import { Link } from "@/lib/i18n/routing";
import { site } from "@/constants/site";
import LocaleSwitch from "./LocaleSwitch";

const Header = ({
	className,	
} : {
	className?: string;
}) => {
	return (
		<header className={cn("flex justify-between items-center w-full p-2", className)}>
			<Link href={'/'}><h1>{site.title}</h1></Link>
			<div className="flex items-center gap-2">
			<LocaleSwitch />
			<ThemeToggle />
			</div>
		</header>
	)
};

export default Header;