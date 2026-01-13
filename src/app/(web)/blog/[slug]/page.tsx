import RichText from "@/components/rich-text";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import getPost from "@/features/blog/api/get-post";
import { BlogPost } from "@/features/blog/components/blog-post";
import SocialIcons from "@/features/blog/components/social-icons";
import type { Blog, FileUpload } from "@/types/payload";
import Link from "next/link";

import BlogNotFound from "@/app/(web)/blog/[slug]/[...not-found]/page";
import StarsAnimation from "@/app/(web)/stars-animation";
import CircularGlow from "@/components/circular-glow";
import NewsletterSection from "@/components/newsletter";
import "@/styles/rich-text.css";

type Props = {
	params: Promise<{ slug: string }>;
};

export default async function BlogPostPage({ params }: Props) {
	const { slug } = await params;

	const blogPost = await getPost(slug);

	if (!blogPost) {
		// TODO: Find if ther is a better way for server components to handle this
		return <BlogNotFound />;
	}

	const featuredImage = blogPost?.featuredImage as FileUpload;

	const relatedPosts = (blogPost.relatedPosts?.slice(0, 3) ?? []) as Blog[];

	return (
		<main className="relative">
			<CircularGlow className="left-1/2 -translate-x-1/2 -translate-y-full" />
			<StarsAnimation className="-z-50 top-[-100px]" />
			<div className="container flex flex-col mt-60 max-w-5xl relative">
				<Heading as="h1" variants="h2" className="text-center">
					{blogPost.title}
				</Heading>
				<img
					src={featuredImage?.url ?? "https://placehold.co/600x400"}
					alt={blogPost.title}
					width={850}
					height={450}
					className="mt-14 mb-20 rounded-xl"
				/>
				{blogPost.content && (
					<RichText data={blogPost.content} className="rich-text-component" />
				)}
				<section className="flex flex-row justify-between mt-16 text-text-300 border-t border-stroke-25 pt-6 mb-52">
					<Body as="p" variants="14-regular">
						Share this post:
					</Body>
					<SocialIcons />
				</section>
			</div>
			{relatedPosts.length > 0 && (
				<section className="container flex flex-col gap-16 bg-background-input py-14 px-10 rounded-xl">
					<Heading as="h2" variants="h3" className="text-center capitalize">
						Recommend blog post
					</Heading>
					<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
						{relatedPosts.map((post: Blog) => (
							<Link key={post.slug} href={`/blog/${post.slug}`}>
								<BlogPost
									isRelated
									imageUrl={
										post.featuredImage?.toString() ??
										"https://placehold.co/600x400"
									}
									title={post.title}
									category={post.category?.name ?? ""}
								/>
							</Link>
						))}
					</div>
				</section>
			)}
			<NewsletterSection />
		</main>
	);
}
