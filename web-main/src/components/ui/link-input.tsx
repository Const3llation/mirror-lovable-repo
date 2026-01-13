import { cn } from "@/utils/cn";

type LinkInputProps = Omit<React.ComponentProps<"input">, "prefix"> & {
	className?: string;
	prefix: string;
	containerClassName?: string;
	label?: string;
	labelClassName?: string;
};

export const LinkInput = ({
	className,
	prefix,
	containerClassName,
	label,
	labelClassName,
	id,
	...props
}: LinkInputProps) => {
	// Generate a unique ID if none provided for label association
	const inputId = id || `link-input-${Math.random().toString(36).substr(2, 9)}`;

	return (
		<div className="w-full">
			{label && (
				<label
					htmlFor={inputId}
					className={cn(
						"block text-sm font-medium text-text-100 mb-2",
						labelClassName,
					)}
				>
					{label}
				</label>
			)}
			<div
				className={cn(
					"w-full relative flex group",
					"focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-0 rounded-lg",
					containerClassName,
				)}
			>
				<div className="bg-background-input border border-r-0 border-stroke-25 text-text-300/50 px-3 py-3 rounded-l-lg whitespace-nowrap group-focus-within:border-primary-500">
					{prefix}
				</div>
				<input
					id={inputId}
					type="text"
					className={cn(
						"bg-background-input border flex-1 border-stroke-25 text-text-100 px-4 py-3 rounded-r-lg",
						"focus:outline-none group-focus-within:border-primary-500",
						className,
					)}
					{...props}
				/>
			</div>
		</div>
	);
};
