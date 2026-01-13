import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";

type Props = {
	category: string | null;
	page?: string;
};

const fetchBlogPosts = async ({ category, page = "1" }: Props) => {
	const params = new URLSearchParams({
		category: category ?? "",
		page,
	});
	const response = await fetch(`/api/blog/posts?${params}`);

	if (!response.ok) {
		throw new Error(`Failed to fetch blog posts ${response.status}`);
	}

	return response.json();
};

const useBlogPosts = () => {
	const searchParams = useSearchParams();

	const category = searchParams.get("category");

	const page = searchParams.get("page") ?? "1";

	return useQuery({
		queryKey: ["blog-posts", category, page],
		queryFn: () => fetchBlogPosts({ category, page }),
		staleTime: 1000 * 60 * 5,
	});
};

export default useBlogPosts;
