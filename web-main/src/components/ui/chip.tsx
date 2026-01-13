import { Body } from "@/components/ui/body";
import { cn } from "@/utils/cn";

interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
	selected?: boolean;
	children: React.ReactNode;
}

export function Chip({
	selected = false,
	children,
	className,
	...props
}: ChipProps) {
	return (
		<button
			type="button"
			className={cn(
				"relative text-text-100 rounded-full",
				"before:absolute before:inset-0 before:rounded-full before:p-[1px] before:bg-gradient-3",
				"before:transition-opacity before:duration-200",
				selected
					? "before:opacity-100 px-[17px] py-[9px]"
					: "before:opacity-0 bg-background-input hover:bg-background-300 border border-stroke-25 hover:border-stroke-50 px-4 py-2",
				className,
			)}
			{...props}
		>
			{selected ? (
				<span
					className={cn(
						"relative z-10",
						"bg-gradient-3 rounded-full block transition-opacity duration-200",
						"px-4 py-2 -mx-[17px] -my-[9px]",
					)}
				>
					<Body variants="14-medium">{children}</Body>
				</span>
			) : (
				<Body variants="14-medium">{children}</Body>
			)}
		</button>
	);
}
