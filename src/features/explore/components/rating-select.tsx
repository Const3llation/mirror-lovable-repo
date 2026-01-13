import Checkbox from "@/components/ui/checkbox";
import {
	MultiSelect,
	type MultiSelectOption,
} from "@/components/ui/multi-select";
import { cn } from "@/utils/cn";
import { Star } from "lucide-react";
import React from "react";

// Create rating options array in reversed order (5 to 1)
const CLIENT_RATING_OPTIONS = ["5", "4", "3", "2", "1"].map((rating) => ({
	id: rating,
	label: `${rating} star${rating !== "1" ? "s" : ""}`,
	value: rating,
}));

type RatingSelectProps = {
	selectedItems?: MultiSelectOption[];
	onChange: (selectedItems: MultiSelectOption[]) => void;
	hideSelectedItemsFromInput?: boolean;
};

const RatingSelect = ({
	selectedItems = [],
	onChange,
	hideSelectedItemsFromInput,
}: RatingSelectProps) => {
	const handleChange = (newSelectedItems: MultiSelectOption[]) => {
		const occurrences = new Map<string, number>();

		for (const item of newSelectedItems) {
			const itemId = String(item.id);
			const count = occurrences.get(itemId) || 0;
			occurrences.set(itemId, count + 1);
		}

		const filteredItems = newSelectedItems.filter(
			(item) => occurrences.get(String(item.id)) === 1,
		);

		onChange(filteredItems);
	};

	const renderCustomOption = React.useCallback(
		({
			option,
			isSelected,
			isHighlighted,
			getItemProps,
			toggleSelection,
			handleKeyDown,
		}: {
			option: MultiSelectOption;
			isSelected: boolean;
			isHighlighted: boolean;
			// biome-ignore lint/suspicious/noExplicitAny: TODO
			getItemProps: any;
			toggleSelection: (option: MultiSelectOption) => void;
			handleKeyDown: (e: React.KeyboardEvent, item: MultiSelectOption) => void;
		}) => {
			const rating = Number(option.value);

			const itemProps = getItemProps({
				item: option,
				index: CLIENT_RATING_OPTIONS.findIndex((o) => o.id === option.id),
				onKeyDown: (e: React.KeyboardEvent) => handleKeyDown(e, option),
				className: cn(
					"flex items-center text-left gap-3 px-3 text-sm cursor-pointer select-none text-text-200",
					isHighlighted ? "bg-background-input" : "bg-transparent",
				),
			});

			const { key, id, role, "aria-selected": ariaSelected } = itemProps;

			const handleItemClick = (e: React.MouseEvent) => {
				if (itemProps.onClick) {
					itemProps.onClick(e);
				}
			};

			const handleItemKeyDown = (e: React.KeyboardEvent) => {
				if (itemProps.onKeyDown) {
					itemProps.onKeyDown(e);
				}
			};

			const handleCheckboxClick = (e: React.MouseEvent) => {
				e.preventDefault();
				e.stopPropagation();
				toggleSelection(option);
			};

			return (
				<li
					key={key}
					id={id}
					role={role}
					aria-selected={ariaSelected}
					onClick={handleItemClick}
					onKeyDown={handleItemKeyDown}
					className={cn(
						"flex items-center text-left gap-3 px-3 text-sm cursor-pointer select-none text-text-200",
						isHighlighted ? "bg-background-input" : "bg-transparent",
					)}
				>
					<div className="checkbox-wrapper" onClick={handleCheckboxClick}>
						<Checkbox
							checked={isSelected}
							onChange={() => toggleSelection(option)}
						/>
					</div>
					<div
						onClick={handleCheckboxClick}
						className="w-full py-2 flex items-center"
					>
						<div className="flex gap-[2px]">
							{[1, 2, 3, 4, 5].map((star) => (
								<Star
									key={star}
									size={18}
									className={cn(
										"transition-colors",
										star <= rating
											? "fill-status-yellow-200 text-status-yellow-200"
											: "text-gray-300",
									)}
								/>
							))}
						</div>
					</div>
				</li>
			);
		},
		[],
	);

	return (
		<MultiSelect
			size={"md"}
			placeholder="Client rating"
			options={CLIENT_RATING_OPTIONS}
			widthStrategy="fit-content"
			selectedItems={selectedItems}
			onChange={handleChange}
			hideSelectedItemsFromInput={hideSelectedItemsFromInput}
			renderOption={renderCustomOption}
		/>
	);
};

export default RatingSelect;
