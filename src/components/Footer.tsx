import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { Link } from "@/lib/i18n/routing";
import { site } from "@/constants/site";
import socialUrl from "@/hooks/social-url";

const Footer = ({
	className,	
} : {
	className?: string;
}) => {
	return (
		<footer className={cn("flex justify-center p-4", className)}>
			<p className="text-xs text-muted-foreground">@{new Date().getFullYear()} Made without ❤️ by <Button variant={'link'} className="p-0" asChild><Link href={socialUrl({ username: site.author.socials.github, platform: "github" })}>{site.author.socials.github}</Link></Button></p>
		</footer>
	)
};

export default Footer;