import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import CategoriesLine from "@/features/service-providers/components/profile/categories-line";
import getUploadDisplayUrl from "@/features/service-providers/utils/get-upload-display-url";
import type { Category, FileUpload } from "@/types/payload";
import Link from "next/link";

export type AchievedMetrics = {
	id: string;
	metric: string;
};

export type PortfolioItemProps = {
	slug: string;
	caseStudySlug: string;
	image: FileUpload;
	title: string;
	achievedMetrics: AchievedMetrics[];
	clientName: string;
	categories: Category[];
	url: string;
	disableReadMore?: boolean;
};

export default function PortfolioItem({
	image,
	title,
	clientName,
	achievedMetrics,
	categories,
	slug,
	caseStudySlug,
	disableReadMore,
}: PortfolioItemProps) {
	return (
		<div
			className="w-11/12 sm:w-full rounded-lg flex flex-col-reverse lg:flex-row min-w-0 flex-shrink-0 flex-grow-0"
			style={{
				background: `linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
                                        linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
                                        radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
			}}
		>
			<div className="flex-1 py-8 px-10 flex flex-col gap-6">
				<CategoriesLine categories={categories} />
				<div className="flex flex-col gap-2">
					<Heading variants="h4" className="text-text-200">
						{title}
					</Heading>
					<Body variants="14-regular" className="text-text-300">
						{clientName}
					</Body>
				</div>
				<div className="flex flex-col gap-2">
					<Body variants="12-regular" className="text-text-300">
						Achieved metrics
					</Body>
					{achievedMetrics.map(({ id, metric }) => (
						<Body key={id} variants="16-regular" className="text-text-200">
							{metric}
						</Body>
					))}
				</div>

				{!disableReadMore && (
					<Link
						href={`/providers/${slug}/projects/${caseStudySlug}`}
						className="flex flex-row gap-2 align-middle"
					>
						<Body variants="16-regular" className="text-primary-100">
							Read more
						</Body>
						<Icon
							name="ArrowRight"
							className="text-primary-100 w-4 h-4 self-center"
						/>
					</Link>
				)}
			</div>
			<div
				className="lg:flex-1 h-44 sm:h-60 lg:h-full rounded-t-lg lg:rounded-r-lg lg:rounded-l-none"
				style={{
					backgroundImage: `url('${getUploadDisplayUrl(image) ?? "https://via.assets.so/img.jpg?w=500&h=500"}')`,
					backgroundSize: "cover",
					backgroundPosition: "center",
					backgroundRepeat: "no-repeat",
				}}
			>
				&nbsp;
			</div>
		</div>
	);
}
