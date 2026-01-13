import StarsAnimation from "@/app/(web)/stars-animation";
import NewsletterSection from "@/components/newsletter";
import type { IconName } from "@/components/ui/icon";
import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import AchievedMetrics from "@/features/service-providers/components/case-study/achieved-metrics";
import CaseStudyHeader from "@/features/service-providers/components/case-study/case-study-header";
import Description from "@/features/service-providers/components/case-study/description";
import Files from "@/features/service-providers/components/case-study/files";
import NextProject from "@/features/service-providers/components/case-study/next-project";
import Services from "@/features/service-providers/components/case-study/services";
import Slider from "@/features/service-providers/components/case-study/slider";
import type { Category, ServiceProvider, SubCategory } from "@/types/payload";
import { notFound } from "next/navigation";

type Props = {
	params: Promise<{ slug: string; project_slug: string }>;
};

type TData = NonNullable<ServiceProvider["caseStudies"]>[number] & {
	nextCaseStudy: NonNullable<ServiceProvider["caseStudies"]>[number];
};

export default async function CaseStudyPage({ params }: Props) {
	const { slug, project_slug } = await params;

	const response = await fetch(
		`${process.env.NEXT_PUBLIC_CMS_URL}/api/providers/case-study?slug=${slug}&project_slug=${project_slug}`,
	);

	if (!response.ok) {
		notFound();
	}

	const data: TData = await response.json();

	const timeline = SERVICE_PROVIDER_TIMELINE_OPTIONS.filter(
		(option) => option.id === data.timeline,
	);

	const budget = SERVICE_PROVIDER_BUDGET_OPTIONS.filter(
		(option) => option.id === data.budget,
	);

	return (
		<div className="relative">
			<StarsAnimation className="-z-50" />
			<div className="flex flex-col gap-16 container max-w-4xl mt-48">
				<CaseStudyHeader
					slug={slug}
					title={data.title ?? ""}
					clientName={data.clientName ?? ""}
					websiteUrl={data.projectUrl ?? ""}
					projectSchedule={timeline?.[0].label}
					projectSize={budget?.[0].label}
				/>
				<Slider />
				<AchievedMetrics metrics={data.achievedMetrics ?? []} />
				<Description description={data.description ?? ""} />
				<Files
					files={[
						{ id: "1", name: "Name of the file", url: "https:google.com" },
					]}
				/>
				<Services
					services={
						(data.serviceCategories?.categories as Category[])?.map(
							(category: Category) => ({
								name: category.name,
								icon: category.icon as IconName,
								serviceItems: (category.subCategories as SubCategory[])?.map(
									(subCategory: SubCategory) => subCategory.name,
								),
							}),
						) ?? []
					}
				/>
				<div className="w-full border-b border-stroke-25 h-[0px]">&nbsp;</div>
				<NextProject
					title={data.nextCaseStudy.title ?? ""}
					clientName={data.nextCaseStudy.clientName ?? ""}
					achievedMetrics={data.nextCaseStudy.achievedMetrics ?? []}
					category={
						data.nextCaseStudy.serviceCategories?.categories as Category[]
					}
					slug={slug}
					caseStudySlug={data.nextCaseStudy.caseStudySlug ?? ""}
					imageUrl={data.nextCaseStudy.images?.[0]?.value as unknown as string}
				/>
			</div>
			<NewsletterSection />
		</div>
	);
}
