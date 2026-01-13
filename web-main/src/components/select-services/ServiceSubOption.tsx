import Checkbox from "@/components/ui/checkbox";
import { cn } from "@/utils/cn";
import React from "react";
import type { EnhancedMultiSelectOption } from "./types";

const ServiceSubOption = React.memo(
	({
		subOption,
		isHighlighted,
		toggleSelection,
		selectedItems,
	}: {
		subOption: EnhancedMultiSelectOption;
		isHighlighted: boolean;
		toggleSelection: (option: EnhancedMultiSelectOption) => void;
		selectedItems: EnhancedMultiSelectOption[];
	}) => {
		const handleToggle = React.useCallback(
			(e?: React.MouseEvent) => {
				if (e) e.stopPropagation();
				toggleSelection(subOption);
			},
			[subOption, toggleSelection],
		);

		const isSelected = selectedItems.some(
			(item) => item.id.toString() === subOption.id.toString(),
		);

		return (
			<div
				className={cn(
					"flex items-center gap-2 px-6 py-2",
					isHighlighted && "bg-background-input",
				)}
			>
				<Checkbox
					checked={isSelected}
					onChange={handleToggle}
					onClick={(e) => e.stopPropagation()}
				/>
				<span className="text-text-300">{subOption.label}</span>
			</div>
		);
	},
);

export default ServiceSubOption;
