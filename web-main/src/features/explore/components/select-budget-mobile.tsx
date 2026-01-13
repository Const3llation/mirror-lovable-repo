"use client";

import React from "react";

import { Body } from "@/components/ui/body";
import Checkbox from "@/components/ui/checkbox";
import type { MultiSelectOption } from "@/components/ui/multi-select";
import { SERVICE_PROVIDER_BUDGET_OPTIONS } from "@/config/consts";

const BudgetItem = React.memo(
	({
		option,
		isSelected,
		toggleSelection,
	}: {
		option: MultiSelectOption;
		isSelected: boolean;
		toggleSelection: (option: MultiSelectOption) => void;
	}) => {
		const handleToggle = React.useCallback(() => {
			toggleSelection(option);
		}, [option, toggleSelection]);

		return (
			<div
				className="flex items-center gap-3 py-3 px-4 cursor-pointer"
				onClick={handleToggle}
			>
				<Checkbox
					checked={isSelected}
					onChange={handleToggle}
					onClick={(e) => e.stopPropagation()}
				/>
				<Body variants="16-regular" className="text-text-200">
					{option.label}
				</Body>
			</div>
		);
	},
);

BudgetItem.displayName = "BudgetItem";

const SelectBudgetMobile = ({
	value = [],
	onChange,
}: {
	value?: MultiSelectOption[];
	onChange?: (value: MultiSelectOption[]) => void;
}) => {
	const handleToggle = (option: MultiSelectOption) => {
		if (!onChange) return;

		// Create a map to count occurrences of each item by id
		const newSelection = value.some((item) => item.id === option.id)
			? value.filter((item) => item.id !== option.id)
			: [...value, option];

		// Count occurrences of each item
		const occurrences = new Map<string | number, number>();
		for (const item of newSelection) {
			const count = occurrences.get(item.id) || 0;
			occurrences.set(item.id, count + 1);
		}

		// Filter out items that appear more than once
		const filteredItems = newSelection.filter(
			(item) => occurrences.get(item.id) === 1,
		);

		onChange(filteredItems);
	};

	const budgetOptions = [
		{ id: "all", label: "Any budget", value: "all" },
		...SERVICE_PROVIDER_BUDGET_OPTIONS,
	];

	return (
		<div className="max-h-[60vh] overflow-y-auto">
			{budgetOptions.map((option) => (
				<BudgetItem
					key={option.id}
					option={option}
					isSelected={value.some((item) => item.id === option.id)}
					toggleSelection={handleToggle}
				/>
			))}
		</div>
	);
};

export default SelectBudgetMobile;
