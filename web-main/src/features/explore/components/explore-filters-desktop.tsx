// @ts-nocheck
import ProjectBudgetSelect from "@/components/project-budget-select";
import SelectServices from "@/components/select-services";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { MultiSelectOption } from "@/components/ui/multi-select";
import LocationSelect from "@/features/explore/components/location-select";
import RatingSelect from "@/features/explore/components/rating-select";
import Search from "@/features/explore/components/search";

type Filters = {
	search: string;
	services: MultiSelectOption[];
	budget: MultiSelectOption[];
	location: MultiSelectOption[];
	rating: MultiSelectOption[];
	page: number;
	limit: number;
};

type ExploreFiltersDesktopProps = {
	filters: Filters;
	searchResults?: {
		totalDocs: number;
	};
	onServicesChange: (selectedItems: MultiSelectOption[]) => void;
	onBudgetChange: (selectedItems: MultiSelectOption[]) => void;
	onLocationChange: (selectedItems: MultiSelectOption[]) => void;
	onRatingChange: (selectedItems: MultiSelectOption[]) => void;
	onClearAll: () => void;
};

const ExploreFiltersDesktop = ({
	filters,
	searchResults,
	onServicesChange,
	onBudgetChange,
	onLocationChange,
	onRatingChange,
	onClearAll,
}: ExploreFiltersDesktopProps) => {
	// Helper function to remove a single filter
	const handleRemoveFilter = (type: keyof Filters, value: string) => {
		const filterUpdateMap = {
			services: onServicesChange,
			budget: onBudgetChange,
			location: onLocationChange,
			rating: onRatingChange,
		};

		const currentFilters = filters[type];
		const updatedFilters = currentFilters.filter(
			(item) => item.value !== value,
		);
		filterUpdateMap[type](updatedFilters);
	};

	return (
		<div className="flex flex-col gap-4 items-start mb-16">
			<div className="flex gap-4 w-full">
				<div className="min-w-[200px] xl:min-w-[380px]">
					<Search />
				</div>
				<SelectServices
					value={filters.services}
					onChange={onServicesChange}
					hideSelectedItemsFromInput
				/>
				<ProjectBudgetSelect
					selectedItems={filters.budget}
					onChange={onBudgetChange}
					hideSelectedItemsFromInput
				/>
				<LocationSelect
					selectedItems={filters.location}
					onChange={onLocationChange}
					hideSelectedItemsFromInput
				/>
				<RatingSelect
					selectedItems={filters.rating}
					onChange={onRatingChange}
					hideSelectedItemsFromInput
				/>
			</div>

			{(filters.services.length > 0 ||
				filters.budget.length > 0 ||
				filters.location.length > 0 ||
				filters.rating.length > 0) && (
				<div className="flex flex-wrap gap-2 items-center">
					{filters.services.map((service) => (
						<div
							key={service.value}
							className="flex items-center gap-2 border border-stroke-200 px-4 py-1 rounded-[5px]"
						>
							<span className="text-xs text-text-100">{service.label}</span>
							<button
								type="button"
								onClick={() => handleRemoveFilter("services", service.value)}
								className="text-primary-100 hover:text-text-100"
							>
								<Icon name="XAction" width={20} height={20} />
							</button>
						</div>
					))}
					{filters.budget.map((item) => (
						<div
							key={item.value}
							className="flex items-center gap-2 border border-stroke-200 px-4 py-1 rounded-[5px]"
						>
							<span className="text-xs text-text-100">{item.label}</span>
							<button
								type="button"
								onClick={() => handleRemoveFilter("budget", item.value)}
								className="text-primary-100 hover:text-text-100"
							>
								<Icon name="XAction" width={20} height={20} />
							</button>
						</div>
					))}
					{filters.location.map((item) => (
						<div
							key={item.value}
							className="flex items-center gap-2 border border-stroke-200 px-4 py-1 rounded-[5px]"
						>
							<span className="text-xs text-text-100">{item.label}</span>
							<button
								type="button"
								onClick={() => handleRemoveFilter("location", item.value)}
								className="text-primary-100 hover:text-text-100"
							>
								<Icon name="XAction" width={20} height={20} />
							</button>
						</div>
					))}
					{filters.rating.map((item) => (
						<div
							key={item.value}
							className="flex items-center gap-2 border border-stroke-200 px-4 py-1 rounded-[5px]"
						>
							<span className="text-xs text-text-100">{item.label}</span>
							<button
								type="button"
								onClick={() => handleRemoveFilter("rating", item.value)}
								className="text-primary-100 hover:text-text-100"
							>
								<Icon name="XAction" width={20} height={20} />
							</button>
						</div>
					))}
					<Button variant="link" size="inline" onClick={onClearAll}>
						Clear all
					</Button>
				</div>
			)}

			<Body variants={"12-regular"} className="text-text-300">
				{searchResults
					? `${searchResults?.totalDocs} companies`
					: "Searching..."}
			</Body>
		</div>
	);
};

export default ExploreFiltersDesktop;
