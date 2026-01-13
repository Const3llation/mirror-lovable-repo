import { useQuery } from "@tanstack/react-query";

interface Service {
	id: string;
	name: string;
	category?: string;
}

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
}

const fetchProvidersList = async (
	params?: ServiceListParams,
): Promise<PayloadResponse<Service>> => {
	const searchParams = new URLSearchParams();

	if (params) {
		for (const [key, value] of Object.entries(params)) {
			if (value) searchParams.append(key, value.toString());
		}
	}

	const url = `/api/providers${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch services");
	}

	return response.json();
};

export const useProvidersList = (params?: ServiceListParams) => {
	const { data, ...rest } = useQuery({
		queryKey: ["providers-list", params],
		queryFn: () => fetchProvidersList(params),
		staleTime: 1000 * 60 * 5,
	});

	return {
		providers: data?.docs ?? [],
		pagination: data ? getPaginationData(data) : null,
		...rest,
	};
};

function getPaginationData(data: PayloadResponse<Service>) {
	return {
		totalDocs: data.totalDocs,
		limit: data.limit,
		totalPages: data.totalPages,
	};
}
