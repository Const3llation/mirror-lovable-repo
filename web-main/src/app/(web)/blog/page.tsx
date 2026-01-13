"use client";

import StarsAnimation from "@/app/(web)/stars-animation";
import CircularGlow from "@/components/circular-glow";
import NewsletterSection from "@/components/newsletter";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import Pagination from "@/components/ui/pagination";
import { BlogPost } from "@/features/blog/components/blog-post";
import { BlogPostSkeleton } from "@/features/blog/components/blog-post-skeleton";
import ChooseCategory from "@/features/blog/components/choose-category";
import { ChooseCategorySkeleton } from "@/features/blog/components/choose-category-skeleton";
import { useBlogCategories } from "@/features/blog/hooks/use-blog-categories";
import useBlogPosts from "@/features/blog/hooks/use-blog-posts";
import type { Blog } from "@/types/payload";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

const BlogPage = () => {
	const { data, isLoading: areBlogCategoriesLoading } = useBlogCategories();
	const { data: blogPostsData, isLoading: areBlogPostsLoading } =
		useBlogPosts();
	const searchParams = useSearchParams();
	const router = useRouter();

	const blogCategories = data ?? [];
	const blogPosts = blogPostsData?.data ?? [];
	const pagination = blogPostsData?.pagination ?? {};

	const handlePageChange = (page: number) => {
		const params = new URLSearchParams(searchParams);
		params.set("page", page.toString());
		router.replace(`?${params.toString()}`, { scroll: true });
	};

	return (
		<main className="relative">
			<CircularGlow className="left-1/2 -translate-x-1/2 -translate-y-full" />
			<StarsAnimation className="-z-50 top-[-100px]" />
			<section className="mt-56 flex flex-col gap-3 relative">
				<Body variants="16-bold" className="mx-auto text-primary-100">
					Our Blog
				</Body>
				<Heading as="h1" className="mx-auto capitalize text-center">
					Insights and Resources
					<br /> for Web3 Projects
				</Heading>
			</section>
			<section className="container max-w-96 mt-16 mb-36 flex flex-col gap-2">
				{areBlogCategoriesLoading ? (
					<ChooseCategorySkeleton />
				) : (
					<ChooseCategory options={blogCategories} />
				)}
			</section>
			<section className="container grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
				{areBlogPostsLoading ? (
					<>
						<BlogPostSkeleton key="post-1" />
						<BlogPostSkeleton key="post-2" />
						<BlogPostSkeleton key="post-3" />
					</>
				) : (
					blogPosts.map((post: Blog) => (
						<Link key={post.slug} href={`/blog/${post.slug}`}>
							<BlogPost
								imageUrl={
									(post.featuredImage as FileUpload)?.url ??
									"https://placehold.co/600x400"
								}
								title={post.title}
								category={post.category?.name ?? ""}
							/>
						</Link>
					))
				)}
			</section>
			<section className="container flex justify-center gap-4 mt-20 mb-32 sm:mb-40 md:mb-52">
				{!areBlogPostsLoading && (
					<Pagination
						{...pagination}
						pageCount={pagination?.totalPages}
						hasPrev={pagination?.hasPrevPage}
						hasNext={pagination?.hasNextPage}
						onPageChange={handlePageChange}
					/>
				)}
			</section>
			<NewsletterSection />
		</main>
	);
};

export default () => (
	<Suspense>
		<BlogPage />
	</Suspense>
);
