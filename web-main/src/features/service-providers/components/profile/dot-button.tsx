import { cn } from "@/utils/cn";

type Props = {
	onClick?: () => void;
	isSelected: boolean;
};

export default function DotButton({ onClick, isSelected }: Props) {
	return (
		<button
			type="button"
			className={cn(
				"w-5 h-5 rounded-full",
				isSelected
					? "bg-primary-100"
					: "bg-background-base border border-stroke-50",
			)}
			onClick={onClick}
		>
			&nbsp;
		</button>
	);
}
