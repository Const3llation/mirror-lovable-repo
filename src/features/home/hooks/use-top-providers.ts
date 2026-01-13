// features/home/hooks/use-top-providers.ts

import type { Category, ServiceProvider } from "@/types/payload";
import { useQuery } from "@tanstack/react-query";

type TopProvidersResponse = {
	categories: Category[];
	providers: ServiceProvider[];
};

const fetchTopProviders = async (
	category?: string,
): Promise<TopProvidersResponse> => {
	const url = category
		? `/api/top-providers?category=${category}`
		: "/api/top-providers";
	const response = await fetch(url);

	if (!response.ok) {
		throw new Error("Failed to fetch top providers");
	}

	return response.json();
};

const useTopProviders = (category?: string) => {
	return useQuery({
		queryKey: ["topProviders", category],
		queryFn: () => fetchTopProviders(category),
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false,
	});
};

export default useTopProviders;
