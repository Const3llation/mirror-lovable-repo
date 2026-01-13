interface AnimatedProgressBarProps {
	progress?: number;
	className?: string;
}

const AnimatedProgressBar = ({
	progress = 0,
	className,
}: AnimatedProgressBarProps) => {
	const normalizedProgress = Math.min(Math.max(progress, 0), 100);

	return (
		<div className="flex items-center gap-1 w-full">
			<div
				className={`flex items-center gap-2 w-full bg-background-100 rounded-full h-4 ${className}`}
			>
				<div
					className="h-full bg-primary-100 rounded-full transition-all duration-100 ease-out"
					style={{ width: `${normalizedProgress}%` }}
				/>
			</div>
			<span className="text-text-200 min-w-[2.5rem]">
				{normalizedProgress.toFixed(0)}%
			</span>
		</div>
	);
};

export default AnimatedProgressBar;
