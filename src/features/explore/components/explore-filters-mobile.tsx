"use client";

import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { MultiSelectOption } from "@/components/ui/multi-select";
import SelectBudgetMobile from "@/features/explore/components/select-budget-mobile";
import SelectLocationMobile from "@/features/explore/components/select-location-mobile";
import SelectRatingMobile from "@/features/explore/components/select-rating-mobile";
import SelectServicesMobile from "@/features/explore/components/select-services-mobile";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import ExploreFilterAccordion from "./explore-filter-accordion";
import Search from "./search";

type Filters = {
	search: string;
	services: MultiSelectOption[];
	budget: MultiSelectOption[];
	location: MultiSelectOption[];
	rating: MultiSelectOption[];
	page: number;
	limit: number;
};

type ExploreFiltersMobileProps = {
	filters: Filters;
	onServicesChange: (selectedItems: MultiSelectOption[]) => void;
	onBudgetChange: (selectedItems: MultiSelectOption[]) => void;
	onLocationChange: (selectedItems: MultiSelectOption[]) => void;
	onRatingChange: (selectedItems: MultiSelectOption[]) => void;
	onClearAll: () => void;
	resultsCount: number;
};

const FILTER_SECTIONS = {
	SERVICES: "SERVICES",
	BUDGET: "BUDGET",
	LOCATION: "LOCATION",
	RATING: "RATING",
} as const;

type FilterSection = keyof typeof FILTER_SECTIONS;

const ExploreFiltersMobile = ({
	filters,
	onServicesChange,
	onBudgetChange,
	onLocationChange,
	onRatingChange,
	onClearAll,
	resultsCount = 0,
}: ExploreFiltersMobileProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [expandedSection, setExpandedSection] = useState<FilterSection | null>(
		FILTER_SECTIONS.SERVICES,
	);

	const { targetRef, isIntersecting } = useIntersectionObserver({
		rootMargin: "-104px 0px 0px 0px",
		threshold: [0, 1],
		delay: 20,
	});

	const handleClearAll = () => {
		onClearAll();
	};

	const selectedFiltersCount =
		filters.services.length +
		filters.budget.length +
		filters.location.length +
		filters.rating.length;

	return (
		<>
			<div
				ref={targetRef as React.RefObject<HTMLDivElement>}
				className="w-full bg-background-base"
			>
				<div
					className={cn(
						"w-full bg-background-base will-change-transform",
						!isIntersecting
							? "fixed top-[104px] left-0 right-0 z-[100] px-4 py-4 border-b border-stroke-25 translate-y-0"
							: "translate-y-0",
					)}
				>
					<div className="flex gap-2 w-full">
						<div className="flex-1">
							<Search />
							<div className="text-left mt-2">
								<Body variants="14-regular" className="text-text-100">
									Showing {resultsCount} results
								</Body>
							</div>
						</div>
						<Button
							type="button"
							variant="secondary"
							onClick={() => setIsOpen(true)}
							className="h-10 flex items-center px-[10px] py-2 border border-stroke-25 rounded-lg shrink-0"
							iconLeft={
								<Icon
									name="SlidersVertical"
									className="text-text-100"
									width={24}
									height={24}
								/>
							}
						>
							<Body variants="16-medium" className="hidden sm:block">
								All Filters ({selectedFiltersCount})
							</Body>
							<Body variants="16-medium" className="sm:hidden">
								({selectedFiltersCount})
							</Body>
						</Button>
					</div>
				</div>
				{!isIntersecting && <div className="h-[92px]" />}
			</div>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, x: "100%" }}
						animate={{ opacity: 1, x: 0 }}
						exit={{ opacity: 0, x: "100%" }}
						transition={{
							duration: 0.3,
							ease: [0.32, 0.72, 0, 1],
						}}
						className="fixed inset-0 bg-background-base z-[9999]"
					>
						<div className="flex items-center justify-between p-4 bg-background-input">
							<div className="w-8" />
							<Body variants="16-medium" className="text-text-100">
								All Filters
							</Body>
							<button
								type="button"
								onClick={() => setIsOpen(false)}
								className="w-8 h-8"
							>
								<Icon name="XAction" className="text-text-100 w-8 h-8" />
							</button>
						</div>

						<div className="flex items-center justify-between p-4">
							<Body variants="14-regular" className="text-text-100">
								{selectedFiltersCount} selected
							</Body>
							<Button
								type="button"
								variant="link"
								size="sm"
								onClick={handleClearAll}
							>
								Clear all
							</Button>
						</div>

						<div className="overflow-auto h-[calc(100vh-64px)]">
							<ExploreFilterAccordion
								title="Services"
								isExpanded={expandedSection === FILTER_SECTIONS.SERVICES}
								onToggle={() =>
									setExpandedSection(
										expandedSection === FILTER_SECTIONS.SERVICES
											? null
											: FILTER_SECTIONS.SERVICES,
									)
								}
								fixedHeight
							>
								<div className="px-4">
									<SelectServicesMobile
										value={filters.services}
										onChange={onServicesChange}
									/>
								</div>
							</ExploreFilterAccordion>

							<ExploreFilterAccordion
								title="Budget"
								isExpanded={expandedSection === FILTER_SECTIONS.BUDGET}
								onToggle={() =>
									setExpandedSection(
										expandedSection === FILTER_SECTIONS.BUDGET
											? null
											: FILTER_SECTIONS.BUDGET,
									)
								}
							>
								<div className="px-4">
									<SelectBudgetMobile
										value={filters.budget}
										onChange={onBudgetChange}
									/>
								</div>
							</ExploreFilterAccordion>

							<ExploreFilterAccordion
								title="Company location"
								isExpanded={expandedSection === FILTER_SECTIONS.LOCATION}
								onToggle={() =>
									setExpandedSection(
										expandedSection === FILTER_SECTIONS.LOCATION
											? null
											: FILTER_SECTIONS.LOCATION,
									)
								}
							>
								<div className="px-4">
									<SelectLocationMobile
										value={filters.location}
										onChange={onLocationChange}
									/>
								</div>
							</ExploreFilterAccordion>

							<ExploreFilterAccordion
								title="Rating"
								isExpanded={expandedSection === FILTER_SECTIONS.RATING}
								onToggle={() =>
									setExpandedSection(
										expandedSection === FILTER_SECTIONS.RATING
											? null
											: FILTER_SECTIONS.RATING,
									)
								}
							>
								<div className="px-4">
									<SelectRatingMobile
										value={filters.rating}
										onChange={onRatingChange}
									/>
								</div>
							</ExploreFilterAccordion>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</>
	);
};

export default ExploreFiltersMobile;
