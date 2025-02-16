import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "@/lib/i18n/routing";
import { site } from "@/constants/site";

const Footer = ({
	className,	
} : {
	className?: string;
}) => {
	return (
		<footer className={cn("flex justify-center p-4", className)}>
			<p className="text-xs text-muted-foreground">@{new Date().getFullYear()} Made without ❤️ by <Button variant={'link'} className="p-0" asChild><Link href={site.author.socials.github.url}>{site.author.socials.github.username}</Link></Button></p>
		</footer>
	)
};

export default Footer;