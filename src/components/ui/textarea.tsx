import { cn } from "@/utils/cn";
import { match } from "ts-pattern";

type TextareaProps = React.ComponentProps<"textarea"> & {
	className?: string;
	resize?: boolean | "vertical" | "horizontal" | "none";
	maxLength?: number;
	counterClassName?: string;
	/** Label text or element to display above the textarea */
	label?: string | React.ReactNode;
	/** Error message to display below the textarea */
	error?: string;
};

const getResizeClass = (resize: TextareaProps["resize"]) => {
	if (resize === true) return "resize";
	if (resize === "vertical") return "resize-y";
	if (resize === "horizontal") return "resize-x";
	return "resize-none";
};

const getProgressColor = (percentage: number) => {
	return match(percentage)
		.when(
			(p) => p >= 90,
			() => "text-red-500",
		)
		.when(
			(p) => p >= 70,
			() => "text-orange-500",
		)
		.otherwise(() => "text-primary-100");
};

export const Textarea = ({
	className,
	resize = false,
	maxLength,
	counterClassName,
	label,
	error,
	id,
	...props
}: TextareaProps) => {
	const currentLength =
		props.value?.toString().length ??
		props.defaultValue?.toString().length ??
		0;
	const percentage = maxLength ? (currentLength / maxLength) * 100 : 0;

	// Generate an ID for the textarea if none is provided
	const textareaId =
		id ||
		(typeof label === "string"
			? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}`
			: `textarea-${Math.random().toString(36).slice(2)}`);

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={textareaId}
					className={cn(
						"mb-3 block text-left text-sm font-medium",
						error ? "text-red-500" : "text-text-100",
					)}
				>
					{label}
				</label>
			)}
			<div className="w-full group relative">
				<div className="absolute -inset-[2px] rounded-lg pointer-events-none opacity-0 group-focus-within:opacity-100 ring-2 ring-white z-0" />
				<textarea
					id={textareaId}
					className={cn(
						"bg-background-input border-l border-r border-t text-text-100 px-4",
						"rounded-t-lg",
						"min-h-[80px] w-full py-3",
						"[&:after]:content-[''] [&:after]:block [&:after]:h-6",
						"focus:outline-none",
						"block",
						"relative z-10",
						error ? "border-red-500" : "border-stroke-25",
						getResizeClass(resize),
						className,
					)}
					aria-invalid={error ? "true" : "false"}
					aria-describedby={error ? `${textareaId}-error` : undefined}
					maxLength={maxLength}
					{...props}
				/>
				{maxLength && (
					<div
						className={cn(
							"bg-background-input border-l border-r border-b",
							error ? "border-red-500" : "border-stroke-25",
							"rounded-b-lg",
							"py-1.5 px-2 text-right",
							"text-text-300 text-sm",
							"block",
							"relative z-10",
							"flex items-center justify-end gap-2",
							counterClassName,
						)}
						aria-label={`Character count: ${currentLength} of ${maxLength}`}
					>
						{currentLength}/{maxLength}
						<div className="relative w-4 h-4">
							<svg
								className={cn(
									"w-4 h-4 transform -rotate-90",
									getProgressColor(percentage),
								)}
								viewBox="0 0 24 24"
							>
								<title>Progress circle</title>
								{/* Background circle */}
								<circle
									className="text-stroke-25"
									strokeWidth="3"
									stroke="currentColor"
									fill="none"
									r="10"
									cx="12"
									cy="12"
								/>
								{/* Progress circle */}
								<circle
									className="transition-all duration-200"
									strokeWidth="3"
									strokeDasharray={`${percentage * 0.628} 62.8`}
									strokeLinecap="round"
									stroke="currentColor"
									fill="none"
									r="10"
									cx="12"
									cy="12"
								/>
							</svg>
						</div>
					</div>
				)}
			</div>
			{error && (
				<p
					id={`${textareaId}-error`}
					className="mt-1.5 text-sm text-red-500 text-left formFieldError"
					role="alert"
				>
					{error}
				</p>
			)}
		</div>
	);
};
