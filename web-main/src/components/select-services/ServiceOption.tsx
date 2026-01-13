import Checkbox from "@/components/ui/checkbox";
import { cn } from "@/utils/cn";
import React from "react";
import ServiceSubOption from "./ServiceSubOption";
import type { EnhancedMultiSelectOption } from "./types";

const ServiceOption = React.memo(
	({
		option,
		isSelected,
		isHighlighted,
		toggleSelection,
		selectedItems,
	}: {
		option: EnhancedMultiSelectOption;
		isSelected: boolean;
		isHighlighted: boolean;
		toggleSelection: (option: EnhancedMultiSelectOption) => void;
		selectedItems: EnhancedMultiSelectOption[];
	}) => {
		const handleToggle = React.useCallback(
			(e?: React.MouseEvent) => {
				if (e) e.stopPropagation();
				toggleSelection(option);
			},
			[option, toggleSelection],
		);

		return (
			<>
				<div
					className={cn(
						"flex items-center gap-2 px-3 py-2",
						isHighlighted && "bg-background-input",
					)}
				>
					<Checkbox
						checked={isSelected}
						onChange={handleToggle}
						onClick={(e) => e.stopPropagation()}
					/>
					<span className="text-text-200">{option.label}</span>
				</div>

				{option.subService?.map((subOption) => {
					const subOptionData: EnhancedMultiSelectOption = {
						id: subOption.id,
						label: subOption.label,
						value: subOption.value,
						type: subOption.type ?? "sub-category",
					};

					return (
						<ServiceSubOption
							key={subOption.id}
							subOption={subOptionData}
							isHighlighted={isHighlighted}
							toggleSelection={toggleSelection}
							selectedItems={selectedItems}
						/>
					);
				})}
			</>
		);
	},
);

export default ServiceOption;
