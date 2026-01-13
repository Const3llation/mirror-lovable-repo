// @ts-nocheck

"use client";

import Checkbox from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { type ServiceOption, filterServices } from "@/utils/filter-services";
import { type VariantProps, cva } from "class-variance-authority";
import { useCombobox, useMultipleSelection } from "downshift";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import * as React from "react";

export interface MultiSelectOption {
	id: string | number;
	label: string;
	value: string | number;
	type?: "category" | "sub-category";
	subService?: ServiceOption[];
}

type WidthStrategy = "parent" | "fit-content" | "fixed" | "min-parent";

const selectVariants = cva(
	"relative w-full rounded-md border border-stroke-25 bg-background-input transition-colors focus-within:border-stroke-100",
	{
		variants: {
			size: {
				lg: "min-h-12",
				md: "min-h-10",
				sm: "min-h-8",
			},
			error: {
				true: "border-status-red-200 focus-within:border-status-red-200",
			},
			isOpen: {
				true: "border-primary-100",
				false: "",
			},
		},
		defaultVariants: {
			size: "lg",
			isOpen: false,
		},
	},
);

const buttonVariants = cva(
	"flex w-full items-center justify-between rounded-md px-3 text-left text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50 text-text-200",
	{
		variants: {
			size: {
				lg: "min-h-12 py-1.5",
				md: "min-h-10 py-1.5",
				sm: "min-h-8 py-1",
			},
		},
		defaultVariants: {
			size: "lg",
		},
	},
);

const menuVariants = cva(
	"absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-stroke-25 bg-background-base py-1 shadow-lg [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-stroke-25 [&::-webkit-scrollbar-thumb:hover]:bg-stroke-50",
	{
		variants: {
			size: {
				lg: "top-12",
				md: "top-10",
				sm: "top-8",
			},
			widthStrategy: {
				parent: "w-full",
				"fit-content": "w-max min-w-full",
				fixed: "w-[540px]",
				"min-parent": "min-w-full",
			},
		},
		defaultVariants: {
			size: "lg",
			widthStrategy: "parent",
		},
	},
);

export interface MultiSelectProps
	extends Omit<VariantProps<typeof selectVariants>, "error">,
		Omit<React.HTMLAttributes<HTMLDivElement>, "onChange"> {
	options: MultiSelectOption[];
	selectedItems?: MultiSelectOption[];
	onChange?: (options: MultiSelectOption[]) => void;
	placeholder?: string;
	label?: string;
	error?: string;
	disabled?: boolean;
	className?: string;
	withSearch?: boolean;
	widthStrategy?: WidthStrategy;
	renderOption?: (props: {
		option: MultiSelectOption;
		isSelected: boolean;
		isHighlighted: boolean;
		getItemProps: (options: unknown) => unknown;
		toggleSelection: (option: MultiSelectOption) => void;
		handleKeyDown: (e: React.KeyboardEvent, item: MultiSelectOption) => void;
		selectedItems: MultiSelectOption[];
	}) => React.ReactNode;
	renderEmpty?: () => React.ReactNode;
	hideSelectedItemsFromInput?: boolean;
}

const SelectItem = React.memo(
	({
		item,
		index,
		isSelected,
		highlightedIndex,
		getItemProps,
		toggleSelection,
		handleKeyDown,
	}: {
		item: MultiSelectOption;
		index: number;
		isSelected: boolean;
		highlightedIndex: number;
		getItemProps: unknown;
		toggleSelection: (item: MultiSelectOption) => void;
		handleKeyDown: (e: React.KeyboardEvent, item: MultiSelectOption) => void;
	}) => {
		const itemProps = getItemProps({
			item,
			index,
			onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, item),
			onClick: (e) => {
				// Prevent click handling if the click came from checkbox or label
				if ((e.target as HTMLElement).closest(".checkbox-wrapper")) {
					e.preventDefault();
					e.stopPropagation();
					return;
				}
			},
			className: cn(
				"flex items-center text-left gap-3 px-3 text-sm cursor-pointer select-none text-text-200",
				highlightedIndex === index ? "bg-background-input" : "bg-transparent",
			),
		});

		const handleSelection = (e: React.MouseEvent) => {
			e.preventDefault();
			e.stopPropagation();
			toggleSelection(item);
		};

		return (
			<li {...itemProps}>
				<div className="checkbox-wrapper" onClick={handleSelection}>
					<Checkbox
						checked={isSelected}
						onChange={handleSelection}
						className="h-4 w-4"
					/>
				</div>
				<div onClick={handleSelection} className="w-full py-2">
					{item.label}
				</div>
			</li>
		);
	},
);

SelectItem.displayName = "SelectItem";

const SelectedItem = React.memo(
	({
		item,
		removeSelectedItem,
	}: {
		item: MultiSelectOption;
		removeSelectedItem: (item: MultiSelectOption) => void;
	}) => (
		<span
			className="flex items-center gap-1 rounded bg-background-300 px-2 py-1 text-sm"
			onClick={(e) => e.stopPropagation()}
		>
			{item.label}
			<button
				type="button"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
					removeSelectedItem(item);
				}}
				className="text-text-300 hover:text-text-200"
			>
				<X className="h-3 w-3" />
			</button>
		</span>
	),
);

export const MultiSelect = React.memo(
	React.forwardRef<HTMLDivElement, MultiSelectProps>(
		(
			{
				options,
				selectedItems = [],
				onChange,
				placeholder = "Select options",
				label,
				error,
				disabled = false,
				size = "lg",
				className,
				withSearch = false,
				widthStrategy = "parent",
				renderEmpty,
				renderOption,
				hideSelectedItemsFromInput = false,
				...props
			},
			ref,
		) => {
			const [inputValue, setInputValue] = React.useState("");
			const [isFocused, setIsFocused] = React.useState(false);

			const handleToggleSelection = React.useCallback(
				(option: MultiSelectOption) => {
					if (!onChange) return;

					const isSelected = selectedItems.some(
						(item) => Number(item.id) === Number(option.id),
					);
					if (isSelected) {
						onChange(
							selectedItems.filter(
								(item) => Number(item.id) !== Number(option.id),
							),
						);
					} else {
						onChange([...selectedItems, option]);
					}
				},
				[onChange, selectedItems],
			);

			const { getSelectedItemProps, getDropdownProps } = useMultipleSelection({
				selectedItems,
			});

			const filteredOptions = React.useMemo(() => {
				if (!inputValue) return options;

				if (options.some((option) => "subService" in option)) {
					return filterServices(options as ServiceOption[], inputValue);
				}

				return options.filter((option) =>
					option.label.toLowerCase().includes(inputValue.toLowerCase()),
				);
			}, [options, inputValue]);

			const {
				isOpen,
				getToggleButtonProps,
				getLabelProps,
				getMenuProps,
				getInputProps,
				getItemProps,
				highlightedIndex,
			} = useCombobox({
				items: filteredOptions,
				inputValue,
				onInputValueChange: ({ inputValue }) => {
					setInputValue(inputValue || "");
				},
				stateReducer: (state, actionAndChanges) => {
					const { changes, type } = actionAndChanges;
					switch (type) {
						case useCombobox.stateChangeTypes.InputKeyDownEnter:
						case useCombobox.stateChangeTypes.ItemClick:
							return {
								...changes,
								isOpen: true,
								highlightedIndex: state.highlightedIndex,
								inputValue: "",
							};
						default:
							return changes;
					}
				},
			});

			const handleKeyDown = React.useCallback(
				(e: React.KeyboardEvent, item: MultiSelectOption) => {
					if (e.key === " " || e.key === "Enter") {
						e.preventDefault();
						handleToggleSelection(item);
					}
				},
				[handleToggleSelection],
			);

			const handleFocus = React.useCallback(() => setIsFocused(true), []);
			const handleBlur = React.useCallback(() => setIsFocused(false), []);

			const dropdownProps = React.useMemo(
				() => ({
					preventKeyAction: isOpen,
					onFocus: handleFocus,
					onBlur: handleBlur,
				}),
				[isOpen, handleFocus, handleBlur],
			);

			return (
				<div ref={ref} className="w-full" {...props}>
					{label && (
						<label
							{...getLabelProps()}
							className="mb-3 block text-sm font-medium text-text-100 text-left"
						>
							{label}
						</label>
					)}

					<div
						className={cn(
							selectVariants({
								size,
								error: !!error,
								isOpen: isOpen || isFocused,
							}),
							className,
						)}
					>
						<div className="relative">
							<div
								{...getToggleButtonProps()}
								className={cn(
									buttonVariants({ size }),
									"flex flex-wrap gap-1 overflow-hidden cursor-pointer",
								)}
							>
								<div className="flex flex-1 flex-wrap gap-1">
									{!hideSelectedItemsFromInput ? (
										selectedItems.length > 0 ? (
											selectedItems.map((item, index) => (
												<SelectedItem
													key={item.id}
													item={item}
													removeSelectedItem={handleToggleSelection}
												/>
											))
										) : (
											<span className="text-text-300">{placeholder}</span>
										)
									) : (
										<span className="text-text-300">
											{selectedItems.length > 0
												? `${selectedItems.length} selected`
												: placeholder}
										</span>
									)}
								</div>
								<span className="ml-auto flex items-center">
									{isOpen ? (
										<ChevronUp className="h-4 w-4" />
									) : (
										<ChevronDown className="h-4 w-4" />
									)}
								</span>
							</div>

							<input
								{...getInputProps(getDropdownProps(dropdownProps))}
								className="sr-only"
							/>

							<ul
								{...getMenuProps()}
								className={
									isOpen ? menuVariants({ size, widthStrategy }) : undefined
								}
							>
								{isOpen && (
									<>
										{withSearch && (
											<div className="sticky top-0 border-b border-stroke-25 bg-background-base p-2 z-[60]">
												<div className="relative">
													<Icon
														name="Search"
														className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-300"
													/>
													<input
														{...getInputProps()}
														className="w-full rounded border border-stroke-25 bg-background-input pl-9 pr-3 py-2 text-sm text-text-200 placeholder-text-300 focus:border-stroke-100 focus:outline-none"
														placeholder="Search options..."
														onClick={(e) => e.stopPropagation()}
													/>
												</div>
											</div>
										)}

										{filteredOptions.length === 0 ? (
											<div className="px-3 py-2 text-sm text-text-300">
												{renderEmpty?.() || "No options available"}
											</div>
										) : (
											filteredOptions.map((item, index) => {
												const isSelected = selectedItems.some(
													(selected) => selected.id === item.id,
												);

												if (renderOption) {
													return renderOption({
														option: item,
														isSelected,
														isHighlighted: highlightedIndex === index,
														getItemProps: (props) =>
															getItemProps({
																item,
																index,
																onKeyDown: (e) => handleKeyDown(e, item),
																...props,
															}),
														toggleSelection: (option) => {
															handleToggleSelection(option);
														},
														handleKeyDown,
														selectedItems,
													});
												}

												return (
													<SelectItem
														key={item.id}
														item={item}
														index={index}
														isSelected={isSelected}
														highlightedIndex={highlightedIndex}
														getItemProps={getItemProps}
														toggleSelection={handleToggleSelection}
														handleKeyDown={handleKeyDown}
													/>
												);
											})
										)}
									</>
								)}
							</ul>
						</div>
					</div>
				</div>
			);
		},
	),
);

MultiSelect.displayName = "MultiSelect";
