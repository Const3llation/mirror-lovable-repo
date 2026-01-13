import SpaceAnimation from "@/app/(web)/space-animation";
import StarsAnimation from "@/app/(web)/stars-animation";
import NewsletterSection from "@/components/newsletter";
import ExploreProvidersList from "@/features/explore/components/explore-providers-list";
import Hero from "@/features/explore/components/hero";

type Props = {
	searchParams: {
		service?: string;
		subService?: string;
	};
};

export default async function ExplorePage({ searchParams }: Props) {
	const { service, subService } = await searchParams;

	return (
		<main>
			<div className="relative">
				<Hero />
				<SpaceAnimation className="-z-50" />
			</div>

			<div className="relative">
				<StarsAnimation className="-z-50" />

				<section className="container text-center mt-24 mb-28">
					<ExploreProvidersList
						initialService={service}
						initialSubService={subService}
					/>
				</section>

				<NewsletterSection />
			</div>
		</main>
	);
}
