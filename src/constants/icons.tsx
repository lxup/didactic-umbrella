import { cn } from "@/lib/utils";
import { CheckIcon, CopyIcon, DownloadIcon, LinkIcon, Loader2Icon, LucideIcon, LucideProps } from "lucide-react";

export type Icon = LucideIcon;

const Icons = {
	check: CheckIcon,
	spinner: Loader2Icon,
	loader: ({ className, ...props }: LucideProps) => (
		<Icons.spinner className={cn('animate-spin', className)} {...props} />
	),
	link: LinkIcon,
	download: DownloadIcon,
	copy: CopyIcon,
}

export default Icons;