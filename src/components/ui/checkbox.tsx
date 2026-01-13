import { cn } from "@/utils/cn";
import { Check } from "lucide-react";
import { forwardRef } from "react";

interface CheckboxProps
	extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onChange"> {
	onChange?: () => void;
	error?: boolean;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
	({ className, checked, onChange, disabled, error, ...props }, ref) => {
		return (
			<label
				className={cn(
					"relative inline-block w-5 h-5",
					disabled && "cursor-not-allowed",
				)}
			>
				<input
					type="checkbox"
					ref={ref}
					checked={checked}
					onChange={onChange}
					disabled={disabled}
					className="sr-only"
					onClick={(e) => e.stopPropagation()}
					{...props}
				/>
				<div
					className={cn(
						"w-full h-full rounded-md border border-white/15 flex items-center justify-center",
						"transition-colors duration-200",
						checked ? "bg-primary-200" : "bg-transparent",
						disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
						error && "border-red-500",
						className,
					)}
				>
					{checked && <Check className="w-[16px] h-[16px] text-white" />}
				</div>
			</label>
		);
	},
);

Checkbox.displayName = "Checkbox";

export default Checkbox;
