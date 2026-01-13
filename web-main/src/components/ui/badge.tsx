import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";

interface BadgeProps {
	showBadge?: boolean;
	type: "green" | "yellow" | "red" | "default";
	children: React.ReactNode;
	className?: string;
}

export const Badge = ({
	children,
	className,
	type,
	showBadge = true,
}: BadgeProps) => {
	return (
		<div
			className={cn(
				"px-3 text-xs font-medium py-1 inline-flex items-center gap-1 rounded-full bg-background-100 border border-stroke-25",
				type === "green" && "bg-status-green-300 text-status-green-100",
				type === "yellow" && "bg-status-yellow-200 text-status-yellow-100",
				type === "red" && "bg-status-red-200 text-status-red-100",
				type === "default" && "text-text-300",
				className,
			)}
		>
			{showBadge && <Icon name="BadgeCheck" width={16} height={16} />}
			{children}
		</div>
	);
};
