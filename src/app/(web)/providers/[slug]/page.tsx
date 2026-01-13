import StarsAnimation from "@/app/(web)/stars-animation";
import NewsletterSection from "@/components/newsletter";
import { SERVICE_PROVIDER_BUDGET_OPTIONS } from "@/config/consts";
import type { AchievedMetrics } from "@/features/service-providers/components/profile/portfolio-item";
import ProviderProfile from "@/features/service-providers/components/profile/provider-profile";
import type {
	Category,
	ServiceProvider,
	SubCategory,
	TeamMember,
} from "@/types/payload";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ slug: string }>;
};

export default async function ProviderProfilePage({ params }: Props) {
	const { slug } = await params;

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CMS_URL}/api/providers?slug=${slug}&reviews=true&depth=2`,
	);

	if (!response.ok) {
		notFound();
	}

	const responseData = await response.json();
	const data = responseData.docs?.[0];

	if (!data) {
		notFound();
	}
	const isVerified = data.visibility.status === "Verified";

	return (
		<div className="relative overflow-hidden">
			<StarsAnimation className="-z-50" />
			<ProviderProfile
				className="mt-72"
				isPreview={false}
				highlights={{
					logo: data.logo,
					slug,
					isVerified,
					providerName: data.providerName,
					foundedYear: data.foundedYear ?? "Undisclosed",
					location: data.addresses?.[0]?.city ?? "Undisclosed",
					companySize: data.companySize ?? "Undisclosed",
					minimumBudget:
						SERVICE_PROVIDER_BUDGET_OPTIONS.find(
							(budget) => budget.value === data.minimumBudget,
						)?.label ?? "Undisclosed",
					websiteUrl: data.websiteUrl,
					findings: data.findings,
					socialMediaLinks: data.socialMediaLinks,
					description: data.providerDescription,
					teamMembers: data.teamMembers.map(
						// biome-ignore lint/suspicious/noExplicitAny: <explanation>
						(teamMember: any) => ({
							name: `${teamMember.firstName} ${teamMember.lastName}`,
							position: teamMember.position,
							image: teamMember.image,
						}),
					) as TeamMember[],
					totalRating: data.reviewsAverage,
				}}
				services={{
					providerName: data.providerName,
					services: data.categories.categories.map((category: Category) => ({
						name: category.name,
						icon: category.icon,
						serviceItems: (data.categories.subCategories as SubCategory[])
							?.filter(
								// biome-ignore lint/suspicious/noExplicitAny: Needed to access category property which may be an ID or a populated object.
								(subCategory: any) => {
									if (typeof subCategory.parentCategory === "object") {
										return subCategory.parentCategory.id === category.id;
									}
									return subCategory.parentCategory === category.id;
								},
							)
							.map((subCategory) => subCategory.name),
					})),
				}}
				portfolio={{
					slug,
					items: data.caseStudies.map(
						(
							caseStudy: NonNullable<ServiceProvider["caseStudies"]>[number],
						) => ({
							title: caseStudy.title,
							clientName: caseStudy.clientName,
							category: caseStudy.serviceCategories?.categories?.[0],
							url: caseStudy.projectUrl,
							caseStudySlug: caseStudy.caseStudySlug,
							categories: caseStudy.serviceCategories?.categories,
							achievedMetrics: caseStudy.achievedMetrics?.map(
								// @ts-ignore
								({ id, metric }: AchievedMetrics) => ({
									id,
									metric,
								}),
							),
							image: caseStudy.images?.[0],
						}),
					),
				}}
				reviews={{
					slug,
					// biome-ignore lint/suspicious/noExplicitAny: <explanation>
					items: data.reviews.map((review: any) => ({
						fullName: `${review.firstName} ${review.lastName}`,
						rating: review.review.rating,
						review: review.review.review,
						category:
							review.categories
								// biome-ignore lint/suspicious/noExplicitAny: <explanation>
								.map((category: any) => category.name)
								?.join(", ") ?? "Undisclosed",
						createdAt: new Date(review.createdAt),
					})),
				}}
			/>
			<NewsletterSection />
		</div>
	);
}
