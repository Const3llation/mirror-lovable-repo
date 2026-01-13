import { cn } from "@/utils/cn";

type IconBadgeProps = {
	size: "sm" | "md" | "lg";
	children: React.ReactNode;
	className?: string;
};

export const SIZE_MAP: Record<
	IconBadgeProps["size"],
	{ outer: string; inner: string; radius: string }
> = {
	sm: {
		outer: "w-6 h-6",
		inner: "w-3 h-3",
		radius: "rounded-[3px]",
	},
	md: {
		outer: "w-8 h-8",
		inner: "w-4 h-4",
		radius: "rounded-lg",
	},
	lg: {
		outer: "w-10 h-10",
		inner: "w-5 h-5",
		radius: "rounded-lg",
	},
};

const IconBadge = ({ size, children, className }: IconBadgeProps) => {
	return (
		<div
			className={cn(
				"border border-white/15 bg-gradient-4 flex items-center justify-center",
				SIZE_MAP[size].outer,
				SIZE_MAP[size].radius,
			)}
		>
			<div
				className={cn(
					"bg-contain bg-center bg-no-repeat",
					SIZE_MAP[size].inner,
					className,
				)}
			>
				{children}
			</div>
		</div>
	);
};

export default IconBadge;
