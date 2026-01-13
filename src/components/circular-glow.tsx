import { cn } from "@/utils/cn";

type Props = {
	className?: string;
};

export default function CircularGlow({ className }: Props) {
	return (
		<div
			className={cn(
				"absolute w-[600px] h-[600px] rounded-full bg-primary-300/25 blur-[150px] [background:radial-gradient(circle_at_bottom,theme(colors.primary.300)_0%,transparent_95%)]",
				className,
			)}
		>
			&nbsp;
		</div>
	);
}
