// @ts-nocheck

"use client";

import CashbackBanner from "@/components/cashback-banner";
import CircularGlow from "@/components/circular-glow";
import type { MultiSelectOption } from "@/components/ui/multi-select";
import Pagination from "@/components/ui/pagination";
import ExploreFiltersDesktop from "@/features/explore/components/explore-filters-desktop";
import ExploreFiltersMobile from "@/features/explore/components/explore-filters-mobile";
import FiltersSort from "@/features/explore/components/filters-sort";
import ProviderCardSkeleton from "@/features/explore/components/provider-card-skeleton";
import ServiceProviderCard from "@/features/explore/components/service-provider-card";
import useDebounce from "@/hooks/use-debounce";
import { useServiceList } from "@/hooks/use-services-list";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

type Filters = {
	search: string;
	services: MultiSelectOption[];
	budget: MultiSelectOption[];
	location: MultiSelectOption[];
	rating: MultiSelectOption[];
	page: number;
	limit: number;
	sortBy: string | null;
};

type SearchResponse = {
	docs: ServiceProvider[];
	totalDocs: number;
	totalPages: number;
	page: number;
	hasNext: boolean;
	hasPrev: boolean;
	limit: number;
};

type ExploreFiltersProps = {
	initialService?: string;
	initialSubService?: string;
};

const ExploreFilters = ({
	initialService,
	initialSubService,
}: ExploreFiltersProps) => {
	const router = useRouter();
	const { services, isLoading, isError } = useServiceList({ depth: 2 });

	const [filters, setFilters] = useState<Filters>({
		search: "",
		services: [],
		budget: [],
		location: [],
		rating: [],
		page: 1,
		limit: 10,
		sortBy: null,
	});

	// Set initial service and subservice when component mounts
	useEffect(() => {
		if ((initialService || initialSubService) && !isLoading && !isError) {
			const initialServices: MultiSelectOption[] = [];

			// Find category by slug
			if (initialService) {
				const category = services.find((s) => s.slug === initialService);
				if (category) {
					initialServices.push({
						id: category.id,
						value: category.id,
						label: category.name,
						type: "category",
					});
				}
			}

			// Find sub-category by slug
			if (initialSubService) {
				for (const service of services) {
					const sub = service.subCategories?.find(
						(sub) => sub.slug === initialSubService,
					);
					if (sub) {
						initialServices.push({
							id: sub.id,
							value: sub.id,
							label: sub.name,
							type: "sub-category",
						});
						break;
					}
				}
			}

			setFilters((prev) => ({
				...prev,
				services: initialServices,
			}));
		}
	}, [initialService, initialSubService, services, isLoading, isError]);

	const debouncedSearch = useDebounce(filters.search, 300);

	const searchProviders = async (): Promise<SearchResponse> => {
		await new Promise((resolve) => setTimeout(resolve, 1000));

		const params = new URLSearchParams();

		const categoryIds = filters.services
			.filter((s) => s.type === "category")
			.map((s) => s.value.toString());
		const subCategoryIds = filters.services
			.filter((s) => s.type === "sub-category")
			.map((s) => s.value.toString());

		if (categoryIds.length > 0) {
			params.set("services", categoryIds.join(","));
		}
		if (subCategoryIds.length > 0) {
			params.set("subServices", subCategoryIds.join(","));
		}

		// Handle budget (excluding 'all' option handling is done in API)
		if (filters.budget.length > 0) {
			params.set(
				"budgets",
				filters.budget.map((b) => b.value.toString()).join(","),
			);
		}

		if (filters.location.length > 0) {
			params.set(
				"locations",
				filters.location.map((l) => l.value.toString()).join(","),
			);
		}

		if (filters.rating.length > 0) {
			params.set(
				"ratings",
				filters.rating.map((r) => r.value.toString()).join(","),
			);
		}

		if (filters.sortBy) {
			params.set("sortBy", filters.sortBy);
		}

		params.set("page", filters.page.toString());
		params.set("limit", filters.limit.toString());

		const response = await fetch(`/api/explore-search?${params}`);
		if (!response.ok) throw new Error("Search failed");

		return response.json();
	};

	const { data: searchResults, isLoading: isSearchLoading } = useQuery({
		queryKey: ["explore-search", filters],
		queryFn: searchProviders,
		keepPreviousData: true,
	});

	const handleSearchChange = useCallback((value: string) => {
		setFilters((prev) => ({ ...prev, search: value, page: 1 }));
	}, []);

	const handleServicesChange = useCallback(
		(selectedItems: MultiSelectOption[]) => {
			const removedServices = filters.services.filter(
				(oldS) => !selectedItems.some((newS) => newS.value === oldS.value),
			);

			if (removedServices.length > 0) {
				const params = new URLSearchParams(window.location.search);
				let urlChanged = false;

				for (const removed of removedServices) {
					let slug: string | undefined;

					if (removed.type === "category") {
						slug = services.find((s) => s.id === removed.value)?.slug;
						if (slug && slug === params.get("service")) {
							params.delete("service");
							urlChanged = true;
						}
					} else if (removed.type === "sub-category") {
						for (const cat of services) {
							const sub = cat.subCategories?.find(
								(s) => s.id === removed.value,
							);
							if (sub) {
								slug = sub.slug;
								break;
							}
						}
						if (slug && slug === params.get("subService")) {
							params.delete("subService");
							urlChanged = true;
						}
					}
				}

				if (urlChanged) {
					router.push(`${window.location.pathname}?${params.toString()}`, {
						scroll: false,
					});
				}
			}

			setFilters((prev) => ({ ...prev, services: selectedItems, page: 1 }));
		},
		[filters.services, services, router],
	);

	const handleBudgetChange = useCallback(
		(selectedItems: MultiSelectOption[]) => {
			setFilters((prev) => ({ ...prev, budget: selectedItems, page: 1 }));
		},
		[],
	);

	const handleLocationChange = useCallback(
		(selectedItems: MultiSelectOption[]) => {
			setFilters((prev) => ({ ...prev, location: selectedItems, page: 1 }));
		},
		[],
	);

	const handleRatingChange = useCallback(
		(selectedItems: MultiSelectOption[]) => {
			setFilters((prev) => ({ ...prev, rating: selectedItems, page: 1 }));
		},
		[],
	);

	const handlePageChange = useCallback((page: number) => {
		setFilters((prev) => ({ ...prev, page }));
	}, []);

	const handleSortByChange = useCallback((value?: string) => {
		setFilters((prev) => ({ ...prev, sortBy: value }));
	}, []);

	const handleClearAllFilters = () => {
		setFilters((prev) => ({
			...prev,
			services: [],
			budget: [],
			location: [],
			rating: [],
			page: 1,
		}));
		const params = new URLSearchParams(window.location.search);
		params.delete("service");
		params.delete("subService");
		router.push(`${window.location.pathname}?${params.toString()}`, {
			scroll: false,
		});
	};

	const handleRedirectToProfile = (slug: string) => {
		router.push(`/providers/${slug}`);
	};

	const firstTwoProviders = searchResults?.docs.slice(0, 2);
	const remainingProviders = searchResults?.docs.slice(2);

	return (
		<div className="flex flex-col">
			<div className="hidden md:block">
				<ExploreFiltersDesktop
					filters={filters}
					searchResults={searchResults}
					onServicesChange={handleServicesChange}
					onBudgetChange={handleBudgetChange}
					onLocationChange={handleLocationChange}
					onRatingChange={handleRatingChange}
					onClearAll={handleClearAllFilters}
				/>
			</div>

			<div className="block md:hidden mb-8">
				<ExploreFiltersMobile
					filters={filters}
					onServicesChange={handleServicesChange}
					onBudgetChange={handleBudgetChange}
					onLocationChange={handleLocationChange}
					onRatingChange={handleRatingChange}
					resultsCount={searchResults?.totalDocs || 0}
					onClearAll={handleClearAllFilters}
				/>
			</div>

			<div className="flex flex-col justify-start md:flex-row mb-12 gap-4 md:gap-8">
				<p className="text-xl md:text-2xl font-medium leading-tight text-text-100 text-left flex-1">
					List of the best agencies across the world
				</p>

				<FiltersSort onChange={handleSortByChange} value={filters.sortBy} />
			</div>

			{isSearchLoading ? (
				<div className="flex flex-col gap-12">
					{[1, 2, 3].map((index) => (
						<ProviderCardSkeleton key={index} />
					))}
				</div>
			) : (
				<>
					<div className="flex flex-col gap-12">
						{firstTwoProviders?.map((provider) => (
							<ServiceProviderCard
								key={provider.id}
								provider={provider}
								onViewProfile={handleRedirectToProfile}
							/>
						))}
						<div className="relative">
							<CashbackBanner />
							<CircularGlow className="hidden md:block -left-1/2 -top-full" />
							<CircularGlow className="hidden md:block -right-1/2 -bottom-full" />
						</div>
						{remainingProviders?.map((provider) => (
							<ServiceProviderCard
								key={provider.id}
								provider={provider}
								onViewProfile={handleRedirectToProfile}
							/>
						))}
					</div>

					{searchResults && (
						<div className="mt-24">
							<Pagination
								total={searchResults.totalDocs}
								pageCount={searchResults.totalPages}
								page={searchResults.page}
								limit={searchResults.limit}
								hasNext={searchResults.hasNext}
								hasPrev={searchResults.hasPrev}
								onPageChange={handlePageChange}
							/>
						</div>
					)}
				</>
			)}
		</div>
	);
};

export default ExploreFilters;
