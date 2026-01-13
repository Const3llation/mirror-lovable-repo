"use client";
import { Body } from "@/components/ui/body";
import Checkbox from "@/components/ui/checkbox";
import { Icon } from "@/components/ui/icon";
import { useServiceList } from "@/hooks/use-services-list";
import type { SubCategory } from "@/types/payload";
import { type ServiceOption, filterServices } from "@/utils/filter-services";
import { useMemo, useState } from "react";
import React from "react";

type EnhancedMultiSelectOption = ServiceOption;

const ServiceItem = React.memo(
	({
		option,
		isSelected,
		toggleSelection,
		selectedItems,
	}: {
		option: EnhancedMultiSelectOption;
		isSelected: boolean;
		toggleSelection: (option: EnhancedMultiSelectOption) => void;
		selectedItems: EnhancedMultiSelectOption[];
	}) => {
		const handleToggle = React.useCallback(() => {
			toggleSelection(option);
		}, [option, toggleSelection]);

		return (
			<>
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

				{option.subService?.map((subOption) => {
					const subOptionData: EnhancedMultiSelectOption = {
						id: subOption.id,
						label: subOption.label,
						value: subOption.value,
						type: "sub-category" as const,
					};

					const isSubSelected = selectedItems.some(
						(item) => item.id.toString() === subOption.id.toString(),
					);

					return (
						<div
							key={subOption.id}
							className="flex items-center gap-3 py-3 px-8 cursor-pointer bg-background-input"
							onClick={() => toggleSelection(subOptionData)}
						>
							<div className="flex-shrink-0">
								<Checkbox
									checked={isSubSelected}
									onChange={() => toggleSelection(subOptionData)}
									onClick={(e) => e.stopPropagation()}
								/>
							</div>
							<Body
								variants="14-regular"
								className="text-text-300 text-left flex-1"
							>
								{subOption.label}
							</Body>
						</div>
					);
				})}
			</>
		);
	},
);

const SelectServicesMobile = ({
	value = [],
	onChange,
}: {
	value?: EnhancedMultiSelectOption[];
	onChange?: (value: EnhancedMultiSelectOption[]) => void;
}) => {
	const { services, isLoading, isError } = useServiceList({ depth: 2 });
	const [searchQuery, setSearchQuery] = useState("");

	const serviceOptions = useMemo(() => {
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

	const filteredServices = useMemo(() => {
		if (!searchQuery) return serviceOptions;
		return filterServices(serviceOptions, searchQuery);
	}, [serviceOptions, searchQuery]);

	const handleToggle = (option: EnhancedMultiSelectOption) => {
		const previousSelection = value || [];
		let updatedSelection = [...previousSelection];

		const isSelected = previousSelection.some(
			(item) => item.id.toString() === option.id.toString(),
		);

		if (isSelected) {
			// Remove the item and its related items
			if (option.type === "category") {
				updatedSelection = updatedSelection.filter(
					(item) =>
						item.id.toString() !== option.id.toString() &&
						!option.subService?.some(
							(sub) => sub.id.toString() === item.id.toString(),
						),
				);
			} else {
				updatedSelection = updatedSelection.filter(
					(item) => item.id.toString() !== option.id.toString(),
				);
			}
		} else {
			// Add the item and its related items
			if (option.type === "category") {
				updatedSelection.push(option);
				for (const subService of option.subService ?? []) {
					if (
						!updatedSelection.some(
							(item) => item.id.toString() === subService.id.toString(),
						)
					) {
						updatedSelection.push(subService);
					}
				}
			} else {
				const parentCategory = serviceOptions.find((category) =>
					category.subService?.some(
						(sub) => sub.id.toString() === option.id.toString(),
					),
				);

				if (
					parentCategory &&
					!updatedSelection.some(
						(item) => item.id.toString() === parentCategory.id.toString(),
					)
				) {
					updatedSelection.push(parentCategory);
				}
				updatedSelection.push(option);
			}
		}

		onChange?.(updatedSelection);
	};

	if (isLoading) {
		return (
			<div className="p-4">
				<Body>Loading services...</Body>
			</div>
		);
	}

	if (isError) {
		return (
			<div className="p-4">
				<Body>Error loading services</Body>
			</div>
		);
	}

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
						placeholder="Search services..."
					/>
				</div>
			</div>

			<div className="max-h-[40vh] overflow-y-auto">
				{filteredServices.length === 0 ? (
					<div className="p-4">
						<Body variants="14-regular" className="text-text-300">
							No services found
						</Body>
					</div>
				) : (
					filteredServices.map((option) => (
						<ServiceItem
							key={option.id}
							option={option}
							isSelected={value.some(
								(item) => item.id.toString() === option.id.toString(),
							)}
							toggleSelection={handleToggle}
							selectedItems={value}
						/>
					))
				)}
			</div>
		</div>
	);
};

export default SelectServicesMobile;
