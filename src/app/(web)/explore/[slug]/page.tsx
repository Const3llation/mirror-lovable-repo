import SpaceAnimation from "@/app/(web)/space-animation";
import StarsAnimation from "@/app/(web)/stars-animation";
import NewsletterSection from "@/components/newsletter";
import { Heading } from "@/components/ui/heading";
import CategoryDescription from "@/features/explore/components/category-description";
import ExploreFilters from "@/features/explore/components/explore-filters";
import { notFound, redirect } from "next/navigation";

type Props = {
	params: Promise<{ slug: string }>;
};

export default async function ExploreCategoryPage({ params }: Props) {
	const { slug } = await params;

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CMS_URL}/api/providers?category=${slug}`,
	);

	if (!response.ok) {
		notFound();
	}

	const { docs } = await response.json();

	// Get the category from the first provider's categories
	const category = docs[0]?.categories?.categories?.find(
		(cat: { slug: string }) => cat.slug === slug,
	);

	if (!category) {
		redirect(`/explore?service=${slug}`);
	}

	return (
		<main>
			<div className="relative p-4 lg:p-20">
				<div className="container pt-44 relative h-full flex flex-col gap-6 items-start">
					<Heading variants="h1" className="text-left text-text-100 capitalize">
						Top {category.name} <br />
						Service Providers
					</Heading>
					<CategoryDescription description={category.description} />
				</div>
				<SpaceAnimation className="-z-50" />
				<div className="absolute bottom-0 left-0 right-0 h-[1px] bg-[linear-gradient(90deg,#030014_0%,rgba(255,255,255,0.15)_51.51%,#030014_100%)]" />
			</div>
			<div className="relative">
				<StarsAnimation className="-z-50" />
				<div className="container pt-20">
					<Heading as="h3" className="mb-8 text-center">
						Search for partners by service, category, or specialty
					</Heading>
					<ExploreFilters initialService={category.slug} />
				</div>
				<NewsletterSection />
			</div>
		</main>
	);
}
