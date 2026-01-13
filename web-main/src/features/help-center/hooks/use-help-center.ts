import { useQuery } from "@tanstack/react-query";

const fetchHelpCenter = async () => {
	const response = await fetch("/api/help-center");

	if (!response.ok) {
		throw new Error("Failed to fetch help center items");
	}

	return response.json();
};

const useHelpCenter = () => {
	return useQuery({
		queryKey: ["helpCenter"],
		queryFn: fetchHelpCenter,
		staleTime: 1000 * 60 * 5, // 5 minutes
		refetchOnWindowFocus: false,
	});
};

export default useHelpCenter;
