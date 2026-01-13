"use client";

import GenericFormError from "@/components/ui/form-error";
import { Heading } from "@/components/ui/heading";
import ServiceCard from "@/features/service-providers/components/forms/registration/service-card";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";
import { useGridLines } from "@/hooks/use-grid-lines";
import { useServiceList } from "@/hooks/use-services-list";
import type { Category } from "@/types/payload";
import { createArray } from "@/utils/create-array";
import { useMemo, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

interface MappedService {
	id: number;
	name: string;
	icon: string;
	subServices?: Array<{
		id: number;
		name: string;
	}>;
}

const mapServices = (services: Category[]): MappedService[] => {
	return services.map((service) => ({
		id: Number(service.id),
		name: service.name,
		icon: service.icon,
		subServices: service.subCategories?.map((sub) => ({
			id: Number(sub.id),
			name: sub.name,
		})),
	}));
};

const ServiceListCardSkeleton = () => {
	return (
		<div className="p-5 flex flex-col gap-5 h-[300px] animate-pulse">
			<div className="w-12 h-12 bg-background-200 rounded shrink-0" />
			<div className="flex flex-col gap-5 h-full">
				<div className="h-6 bg-background-200 rounded w-3/4 shrink-0" />
				<ul className="flex flex-col gap-2 flex-1">
					{createArray(3).map((number) => (
						<li key={`service-list-card-skeleton-${number}`}>
							<div className="h-6 bg-background-200 rounded w-2/3" />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

export default function ServicesForm() {
	const { services, isLoading, error } = useServiceList({
		depth: 2,
		sortByChildCount: true,
	});
	const {
		setValue,
		watch,
		formState: { errors },
	} = useFormContext<z.infer<typeof serviceProviderFormSchema>>();
	const containerRef = useRef<HTMLDivElement>(null);
	const gridLines = useGridLines({
		containerRef,
		numColumns: 3,
		isLoading,
		dependencies: [services],
	});

	const selectedCategories = watch("services.categories") || [];
	const selectedSubCategories = watch("services.subCategories") || [];

	const selectedServiceGroups = useMemo(() => {
		if (!services) return {};

		const groups: Record<number, number[]> = {};

		for (const subCategoryId of selectedSubCategories) {
			const parentService = services.find((service) =>
				service.subCategories?.some((sub) => String(sub.id) === subCategoryId),
			);

			if (parentService) {
				const serviceId = Number(parentService.id);
				const subId = Number(subCategoryId);

				groups[serviceId] = groups[serviceId] || [];
				groups[serviceId].push(subId);
			}
		}

		return groups;
	}, [selectedSubCategories, services]);

	const handleServiceSelection = ({
		serviceId,
		selectedSubServices,
	}: {
		serviceId: number;
		selectedSubServices: number[];
	}) => {
		const service = services?.find((s) => Number(s.id) === serviceId);
		const hasSubServices =
			service?.subCategories && service.subCategories.length > 0;

		const otherCategories = selectedCategories.filter(
			(categoryId) => Number(categoryId) !== serviceId,
		);

		const otherSubCategories = selectedSubCategories.filter((subCategoryId) => {
			const parentService = services?.find((service) =>
				service.subCategories?.some((sub) => String(sub.id) === subCategoryId),
			);
			return !parentService || Number(parentService.id) !== serviceId;
		});

		const isCurrentlySelected = selectedCategories.includes(String(serviceId));
		const newCategories = hasSubServices
			? selectedSubServices.length > 0
				? [...otherCategories, String(serviceId)]
				: otherCategories
			: !isCurrentlySelected
				? [...otherCategories, String(serviceId)]
				: otherCategories;

		setValue(
			"services",
			{
				categories: newCategories,
				subCategories: [
					...otherSubCategories,
					...selectedSubServices.map(String),
				],
			},
			{
				shouldDirty: true,
				shouldTouch: true,
				shouldValidate: true,
			},
		);
	};

	if (error) return <div>Error: {error.message}</div>;

	const mappedServices = services ? mapServices(services) : [];

	return (
		<div className="flex flex-col">
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Services
			</Heading>

			<div className="relative flex flex-col mb-14">
				<div className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
					<div ref={containerRef} className="contents">
						{isLoading
							? createArray(12).map((index) => (
									<div key={`skeleton-${index}`}>
										<ServiceListCardSkeleton />
									</div>
								))
							: mappedServices.map((service) => {
									const selectedSubs = selectedServiceGroups[service.id];

									return (
										<ServiceCard
											key={service.id}
											service={service}
											onSelectionChange={handleServiceSelection}
											initialSelectedServices={{
												subCategories: selectedSubs || [],
												categories: selectedCategories,
											}}
										/>
									);
								})}
					</div>

					{/* Border overlay */}
					{!isLoading && (
						<div className="hidden lg:block absolute inset-0 pointer-events-none">
							{/* Vertical borders */}
							<div className="absolute top-0 left-0 h-full w-px border-l border-white/5" />
							<div className="absolute top-0 right-0 h-full w-px border-r border-white/5" />

							{/* Inner vertical borders */}
							{gridLines.vertical.map((position) => (
								<div
									key={`v-border-${position}`}
									className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.12)] to-transparent"
									style={{
										left: `${position}px`,
									}}
								/>
							))}

							{/* Horizontal borders */}
							{gridLines.horizontal.map((position) => (
								<div
									key={`h-border-${position}`}
									className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.12)] to-transparent"
									style={{
										top: `${position}px`,
									}}
								/>
							))}
						</div>
					)}
				</div>
				{errors.services?.categories && (
					<GenericFormError message={errors.services.categories.message} />
				)}
			</div>
		</div>
	);
}
