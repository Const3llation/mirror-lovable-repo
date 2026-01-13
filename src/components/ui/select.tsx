// @ts-nocheck

"use client";

import { cn } from "@/utils/cn";
import { type VariantProps, cva } from "class-variance-authority";
import { useSelect } from "downshift";
import { ChevronDown, ChevronUp } from "lucide-react";
import * as React from "react";

/**
 * Interface defining the structure of a select option.
 */
export interface SelectOption {
	/** Unique identifier for the option */
	id: string;
	/** Display text for the option */
	label: string;
	/** Value to be used when the option is selected */
	value: string;
}

/**
 * Styling variants for the select container
 */
const selectVariants = cva(
	"relative w-full rounded-md border border-stroke-25 bg-background-input transition-colors focus-within:border-stroke-100",
	{
		variants: {
			/**
			 * Size variants affecting the height of the select
			 * - lg: Large (48px height)
			 * - md: Medium (40px height)
			 * - sm: Small (32px height)
			 */
			size: {
				lg: "min-h-12",
				md: "min-h-10",
				sm: "min-h-8",
			},
			/** Error state styling */
			error: {
				true: "border-status-red-200 focus-within:border-status-red-200",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	},
);

/**
 * Styling variants for the select button
 */
const buttonVariants = cva(
	"flex w-full items-center justify-between rounded-md px-3 text-left text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-text-200",
	{
		variants: {
			/**
			 * Size variants matching the container sizes
			 */
			size: {
				lg: "h-12",
				md: "h-10",
				sm: "h-8",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	},
);

/**
 * Styling variants for the dropdown menu
 */
const menuVariants = cva(
	"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-stroke-25 bg-background-base py-1 shadow-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stroke-25 [&::-webkit-scrollbar-thumb:hover]:bg-stroke-50",
	{
		variants: {
			/**
			 * Size variants determining the menu position
			 */
			size: {
				lg: "top-12",
				md: "top-10",
				sm: "top-8",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	},
);

/**
 * Props for the Select component.
 * Combines CVA variants with custom select functionality.
 */
export interface SelectProps
	extends Omit<VariantProps<typeof selectVariants>, "error">,
		Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	/** Array of options to display in the select dropdown */
	options: SelectOption[];
	/** Currently selected option */
	value?: SelectOption;
	/** Callback fired when selection changes */
	onChange?: (option: SelectOption | null) => void;
	/** Text to display when no option is selected */
	placeholder?: string;
	/** Label text for the select input */
	label?: string | React.ReactNode;
	/** Error message to display below the select */
	error?: string;
	/** Whether the select is disabled */
	disabled?: boolean;
	/** Additional CSS classes */
	className?: string;
}

/**
 * Select component that provides a customizable dropdown selection interface.
 * Built on top of Downshift for accessibility and keyboard navigation.
 *
 * @example
 * // Basic usage
 * <Select
 *   options={[
 *     { id: '1', label: 'Option 1', value: '1' },
 *     { id: '2', label: 'Option 2', value: '2' }
 *   ]}
 *   placeholder="Select an option"
 * />
 *
 * @example
 * // With label and error
 * <Select
 *   label="Country"
 *   error="Please select a country"
 *   options={countries}
 * />
 *
 * @example
 * // Controlled component
 * <Select
 *   value={selectedOption}
 *   onChange={handleOptionChange}
 *   options={options}
 * />
 *
 * @example
 * // Different size variant
 * <Select
 *   size="sm"
 *   options={options}
 * />
 */
const Select = React.forwardRef<HTMLDivElement, SelectProps>(
	(
		{
			options,
			value,
			onChange,
			placeholder = "Select option",
			label,
			error,
			disabled = false,
			size,
			className,
			defaultValue,
			...props
		},
		ref,
	) => {
		// Find the matching option for the current value if it exists
		const selectedOption = React.useMemo(() => {
			if (!value) return null;
			// If value is already an option object, use it directly
			if (typeof value === "object" && value.id && value.label && value.value) {
				return value;
			}
			// If value is a string, find the matching option
			return options.find((option) => option.value === value) || null;
		}, [value, options]);

		const {
			isOpen,
			selectedItem,
			getToggleButtonProps,
			getLabelProps,
			getMenuProps,
			highlightedIndex,
			getItemProps,
		} = useSelect({
			items: options,
			selectedItem: selectedOption,
			onSelectedItemChange: ({ selectedItem }) => {
				onChange?.(selectedItem);
			},
			itemToString: (item) => item?.label ?? "",
		});

		// Use selectedItem from downshift for display
		const displayValue = selectedItem?.label || placeholder;

		const selectId = React.useMemo(() => {
			if (!label) return "select";
			return typeof label === "string"
				? `select-${label.toLowerCase().replace(/\s+/g, "-")}`
				: "select";
		}, [label]);

		return (
			<div ref={ref} className="w-full" {...props}>
				{label && (
					<label
						{...getLabelProps()}
						htmlFor={selectId}
						className="mb-3 block text-sm font-medium text-text-100 text-left"
					>
						{label}
					</label>
				)}
				<div
					className={cn(
						selectVariants({ size, error: !!error }),
						"text-left",
						className,
					)}
				>
					<button
						id={selectId}
						type="button"
						{...getToggleButtonProps()}
						disabled={disabled}
						className={buttonVariants({ size })}
						aria-invalid={!!error}
						aria-describedby={error ? `${selectId}-error` : undefined}
					>
						<span className="flex items-center">{displayValue}</span>
						<span className="pointer-events-none flex items-center">
							{isOpen ? (
								<ChevronUp className="h-4 w-4" />
							) : (
								<ChevronDown className="h-4 w-4" />
							)}
						</span>
					</button>

					<ul
						{...getMenuProps()}
						className={isOpen ? menuVariants({ size }) : undefined}
					>
						{isOpen &&
							options.map((item, index) => (
								<li
									key={item.id}
									{...getItemProps({
										item,
										index,
										className: cn(
											"px-3 py-2 text-sm cursor-default select-none text-text-200",
											highlightedIndex === index
												? "bg-background-input"
												: "bg-transparent",
											selectedItem?.id === item.id
												? "font-medium bg-background-input"
												: "font-normal",
										),
									})}
								>
									{item.label}
								</li>
							))}
					</ul>
				</div>
				{error && (
					<p
						id={`${selectId}-error`}
						className="mt-1.5 text-sm text-red-500 text-left formFieldError"
						role="alert"
					>
						{error}
					</p>
				)}
			</div>
		);
	},
);

Select.displayName = "Select";

export { Select };
