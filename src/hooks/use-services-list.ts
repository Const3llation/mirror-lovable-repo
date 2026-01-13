import type { Category } from "@/types/payload";
import { type UseQueryResult, useQuery } from "@tanstack/react-query";

interface PayloadResponse<T> {
	docs: T[];
	totalDocs: number;
	limit: number;
	totalPages: number;
	page: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
}

interface ServiceListParams {
	page?: number;
	limit?: number;
	name?: string;
	category?: string;
	depth?: number;
	sortByChildCount?: boolean;
}

interface PaginationData {
	total: number;
	pageCount: number;
	hasNext: boolean;
	hasPrev: boolean;
	page: number;
	limit: number;
}

interface ServiceListResponse {
	services: Category[];
	pagination: PaginationData | null;
	isLoading: boolean;
	isError: boolean;
	error: Error | null;
}

const buildSearchParams = (params?: ServiceListParams): string => {
	if (!params) return "";

	const searchParams = new URLSearchParams();

	for (const [key, value] of Object.entries(params)) {
		if (value !== undefined && value !== null) {
			searchParams.append(key, value.toString());
		}
	}

	return searchParams.toString() ? `?${searchParams.toString()}` : "";
};

const fetchServiceList = async (
	params?: ServiceListParams,
): Promise<PayloadResponse<Category>> => {
	const searchParamsString = buildSearchParams(params);
	const url = `/api/services${searchParamsString}`;

	const response = await fetch(url);

	if (!response.ok) {
		throw new Error(`Failed to fetch services: ${response.statusText}`);
	}

	return response.json();
};

export const useServiceList = (
	params?: ServiceListParams,
): ServiceListResponse => {
	const {
		data,
		isLoading,
		isError,
		error,
	}: UseQueryResult<PayloadResponse<Category>, Error> = useQuery({
		queryKey: ["service-list", params],
		queryFn: () => fetchServiceList(params),
		staleTime: 1000 * 60 * 5,
	});

	return {
		services: data?.docs ?? [],
		pagination: data
			? {
					total: data.totalDocs,
					pageCount: data.totalPages,
					hasNext: data.hasNextPage,
					hasPrev: data.hasPrevPage,
					page: data.page,
					limit: data.limit,
				}
			: null,
		isLoading,
		isError,
		error: error as Error | null,
	};
};
