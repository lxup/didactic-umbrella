'use client';

import * as React from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface VotingProps extends React.HTMLAttributes<HTMLDivElement> {
	children?: React.ReactNode;
	/**
	 * Callback when the user votes.
	 * @param vote - The vote value.
	 * - `true` - The user voted up.
	 * - `false` - The user voted down.
	 * - `null` - The user abstained from voting.
	 */
	onVote?: (vote: boolean | null) => void;
	allowedVotes?: {
		up?: boolean;
		down?: boolean;
		null?: boolean;
	};
	classNameUp?: string;
	classNameDown?: string;
	classNameNull?: string;
}

const Voting = React.forwardRef<
	HTMLDivElement,
	VotingProps
>(({
	onVote,
	allowedVotes = {
		up: true,
		down: true,
		null: true,
	},
	className,
	classNameUp,
	classNameDown,
	classNameNull,
	...props
}, ref) => {
	return (
		<div
		ref={ref}
		className={cn('flex justify-center gap-2', className)}
		{...props}
		>
			{allowedVotes.up ? <Button variant={'success'} className={cn('w-full', classNameUp)} onClick={() => onVote?.(true)}>👍</Button> : null}
			{allowedVotes.null ? <Button variant={'secondary'} className={cn('', classNameNull)} onClick={() => onVote?.(null)}>🤷</Button> : null}
			{allowedVotes.down ? <Button variant={'destructive'} className={cn('w-full', classNameDown)} onClick={() => onVote?.(false)}>👎</Button> : null}
		</div>
	);
});
Voting.displayName = "Voting";

export default Voting;