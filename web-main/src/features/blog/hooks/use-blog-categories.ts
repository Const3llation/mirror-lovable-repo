import { useQuery } from "@tanstack/react-query";

const fetchBlogCategories = async () => {
	const response = await fetch("/api/blog/categories");

	if (!response.ok) {
		throw new Error(`Failed to fetch blog categories: ${response.statusText}`);
	}

	const data = await response.json();

	return data;
};

export const useBlogCategories = () => {
	return useQuery({
		queryKey: ["blog-categories"],
		queryFn: fetchBlogCategories,
		staleTime: 1000 * 60 * 60 * 24,
	});
};
