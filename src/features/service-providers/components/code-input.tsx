import { cn } from "@/utils/cn";
import type React from "react";
import { type ChangeEvent, type KeyboardEvent, useRef } from "react";

interface CodeInputProps {
	value: string;
	onChange: (value: string) => void;
	disabled?: boolean;
	className?: string;
}

export const CodeInput: React.FC<CodeInputProps> = ({
	value,
	onChange,
	disabled = false,
	className,
}) => {
	const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

	if (inputRefs.current.length === 0) {
		inputRefs.current = Array(4).fill(null);
	}

	const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value.replace(/[^0-9]/g, ""); // Only allow numbers

		if (newValue.length <= 1) {
			const newCodeValue = value.split("");
			newCodeValue[index] = newValue;
			onChange(newCodeValue.join(""));

			// Auto-focus next input if value is entered
			if (newValue.length === 1 && index < 4) {
				inputRefs.current[index + 1]?.focus();
			}
		}
	};

	const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Backspace" && !value[index] && index > 0) {
			// Focus previous input when backspace is pressed on empty input
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowLeft" && index > 0) {
			inputRefs.current[index - 1]?.focus();
		} else if (e.key === "ArrowRight" && index < 4) {
			inputRefs.current[index + 1]?.focus();
		}
	};

	const handlePaste = (e: React.ClipboardEvent) => {
		e.preventDefault();
		const pastedData = e.clipboardData.getData("text").replace(/[^0-9]/g, "");
		const newValue = pastedData.slice(0, 5).padEnd(5, value).slice(0, 5);
		onChange(newValue);
	};

	return (
		<div className={cn("flex gap-2 items-center justify-center", className)}>
			{Array.from({ length: 5 }).map((_, index) => (
				<input
					// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
					key={`code-input-${index}`}
					ref={(el) => {
						inputRefs.current[index] = el;
					}}
					type="text"
					inputMode="numeric"
					pattern="[0-9]*"
					maxLength={1}
					value={value[index] || ""}
					onChange={(e) => handleChange(index, e)}
					onKeyDown={(e) => handleKeyDown(index, e)}
					onPaste={handlePaste}
					disabled={disabled}
					className={cn(
						"w-12 h-12 text-center border rounded-md",
						"bg-background-input border border-stroke-25",
						"focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-transparent",
						"disabled:bg-gray-100 disabled:cursor-not-allowed",
						"text-xl font-semibold text-text-100",
						value[index] && "bg-transparent",
					)}
					aria-label={`Digit ${index + 1} of 5`}
				/>
			))}
		</div>
	);
};
