"use client";
import { Body } from "@/components/ui/body";
import Checkbox from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import type { MultiSelectOption } from "@/components/ui/multi-select";
import { getSupportedCountriesOptions } from "@/utils/country";
import { useMemo, useState } from "react";
import React from "react";

const LOCATION_OPTIONS = getSupportedCountriesOptions().map((country) => ({
	id: country.value,
	...country,
}));

const LocationItem = React.memo(
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

LocationItem.displayName = "LocationItem";

const SelectLocationMobile = ({
	value = [],
	onChange,
}: {
	value?: MultiSelectOption[];
	onChange?: (value: MultiSelectOption[]) => void;
}) => {
	const [searchQuery, setSearchQuery] = useState("");

	const filteredLocations = useMemo(() => {
		if (!searchQuery) return LOCATION_OPTIONS;

		const lowerQuery = searchQuery.toLowerCase();
		return LOCATION_OPTIONS.filter((location) =>
			location.label.toLowerCase().includes(lowerQuery),
		);
	}, [searchQuery]);

	const handleToggle = (option: MultiSelectOption) => {
		if (!onChange) return;

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

	return (
		<div>
			<div className="sticky mb-6">
				<div className="relative">
					<Icon
						name="Search"
						className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-300"
					/>
					<input
						type="text"
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="w-full rounded border border-stroke-25 bg-background-input pl-9 pr-3 py-2 text-sm text-text-200 placeholder-text-300 focus:border-stroke-100 focus:outline-none"
						placeholder="Search locations..."
					/>
				</div>
			</div>

			<div className="max-h-[40vh] overflow-y-auto">
				{filteredLocations.length === 0 ? (
					<div className="p-4">
						<Body variants="14-regular" className="text-text-300">
							No locations found
						</Body>
					</div>
				) : (
					filteredLocations.map((option) => (
						<LocationItem
							key={option.id}
							option={option}
							isSelected={value.some((item) => item.id === option.id)}
							toggleSelection={handleToggle}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default SelectLocationMobile;
