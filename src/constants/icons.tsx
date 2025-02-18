import { cn } from "@/lib/utils";
import { CheckIcon, Loader2Icon, LucideIcon, LucideProps } from "lucide-react";

export type Icon = LucideIcon;

const Icons = {
	check: CheckIcon,
	spinner: Loader2Icon,
	loader: ({ className, ...props }: LucideProps) => (
		<Icons.spinner className={cn('animate-spin', className)} {...props} />
	),
}

export default Icons;