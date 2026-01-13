"use client";
import {
	MultiSelect,
	type MultiSelectOption,
} from "@/components/ui/multi-select";
import { useServiceList } from "@/hooks/use-services-list";
import type { SubCategory } from "@/types/payload";
import { useMemo } from "react";
import ServiceOption from "./ServiceOption";
import type { EnhancedMultiSelectOption } from "./types";

const ensureEnhancedOption = (
	option: MultiSelectOption,
): EnhancedMultiSelectOption => {
	if ((option as EnhancedMultiSelectOption).type)
		return option as EnhancedMultiSelectOption;
	return { ...option, type: "category" };
};

const SelectServices = ({
	value,
	onChange,
	...props
}: {
	value?: EnhancedMultiSelectOption[];
	onChange?: (value: EnhancedMultiSelectOption[]) => void;
	error?: string;
}) => {
	const { services, isLoading, isError } = useServiceList({ depth: 2 });

	const serviceOptions: EnhancedMultiSelectOption[] = useMemo(() => {
		if (isLoading || isError) {
			return [];
		}

		return services.map((service) => ({
			id: service.id,
			label: service.name,
			value: service.id,
			type: "category" as const,
			subService: service?.subCategories?.map((subService) => ({
				id: (subService as SubCategory).id,
				label: (subService as SubCategory).name,
				value: (subService as SubCategory).id,
				type: "sub-category" as const,
			})),
		}));
	}, [services, isLoading, isError]);

	const handleChange = (selectedItems: MultiSelectOption[]) => {
		const enhancedSelected = selectedItems.map(ensureEnhancedOption);
		const previousSelection = (value || []) as EnhancedMultiSelectOption[];

		const removedItems = previousSelection.filter(
			(prev) =>
				!enhancedSelected.some(
					(curr) => curr.id.toString() === prev.id.toString(),
				),
		);

		if (removedItems.length === 0) {
			const lastSelected = enhancedSelected[enhancedSelected.length - 1];
			if (!lastSelected) {
				onChange?.([]);
				return;
			}

			const updatedSelection = [...previousSelection];

			if (lastSelected.type === "category") {
				if (
					!updatedSelection.some(
						(item) => item.id.toString() === lastSelected.id.toString(),
					)
				) {
					updatedSelection.push(lastSelected);
					for (const subService of lastSelected.subService ?? []) {
						if (
							!updatedSelection.some(
								(item) => item.id.toString() === subService.id.toString(),
							)
						) {
							updatedSelection.push(subService);
						}
					}
				}
			} else {
				if (
					!updatedSelection.some(
						(item) => item.id.toString() === lastSelected.id.toString(),
					)
				) {
					updatedSelection.push(lastSelected);
				}
			}

			onChange?.(updatedSelection);
		} else {
			// Handle deselection
			const updatedSelection = previousSelection.filter((item) => {
				for (const removedItem of removedItems) {
					// If a category was removed, remove it and all its sub-services
					if (removedItem.type === "category") {
						const matchingCategory = serviceOptions.find(
							(category) =>
								category.id.toString() === removedItem.id.toString(),
						);

						// Remove the category itself and all its sub-services
						if (
							item.id.toString() === removedItem.id.toString() ||
							matchingCategory?.subService?.some(
								(sub) => sub.id.toString() === item.id.toString(),
							)
						) {
							return false;
						}
					}

					// If a sub-service was removed, just remove that specific sub-service
					if (
						removedItem.type === "sub-category" &&
						removedItem.id.toString() === item.id.toString()
					) {
						return false;
					}
				}
				return true;
			});

			onChange?.(updatedSelection);
		}
	};

	const renderOption = ({
		option,
		isSelected,
		isHighlighted,
		toggleSelection,
		selectedItems,
		...rest
	}: {
		option: MultiSelectOption;
		isSelected: boolean;
		isHighlighted: boolean;
		toggleSelection: (option: MultiSelectOption) => void;
		selectedItems: MultiSelectOption[];
		[key: string]: unknown;
	}) => {
		const enhancedOption = ensureEnhancedOption(option);
		return (
			<li key={enhancedOption.id}>
				<ServiceOption
					option={enhancedOption}
					isSelected={isSelected}
					isHighlighted={isHighlighted}
					toggleSelection={
						toggleSelection as (option: EnhancedMultiSelectOption) => void
					}
					selectedItems={selectedItems as EnhancedMultiSelectOption[]}
				/>
			</li>
		);
	};

	return (
		<MultiSelect
			size="md"
			placeholder="Services"
			options={serviceOptions}
			withSearch
			renderOption={renderOption}
			widthStrategy="fit-content"
			selectedItems={value as MultiSelectOption[]}
			onChange={handleChange}
			{...props}
		/>
	);
};

export default SelectServices;
