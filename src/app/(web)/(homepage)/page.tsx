import SpaceAnimation from "@/app/(web)/space-animation";
import StarsAnimation from "@/app/(web)/stars-animation";
import DiamondIconAnimation from "@/components/animated-illustrations/animated-diamond-icon";
import GlobeIconAnimation from "@/components/animated-illustrations/animated-radial-globe-icon";
import MessageIconAnimation from "@/components/animated-illustrations/animated-radial-message-icon";
import AnimatedShieldIcon from "@/components/animated-illustrations/animated-shield-icon";
import CashbackBanner from "@/components/cashback-banner";
import CircularGlow from "@/components/circular-glow";
import { GlobalSearch } from "@/components/global-search";
import { GradientText } from "@/components/gradient-text";
import NewsletterSection from "@/components/newsletter";
import PartnersBanner from "@/components/partners-banner";
import { Heading } from "@/components/ui/heading";
import CategoriesExplore from "@/features/home/components/categories-explore";
import FeatureCard from "@/features/home/components/feature-card";
import { Hero } from "@/features/home/components/hero";
import { ScrollButton } from "@/features/home/components/scroll-button";
import TopProviders from "@/features/home/components/top-providers";

export default function HomePage() {
	return (
		<main className="relative">
			<SpaceAnimation className={"h-screen w-full"} />
			<Hero className="relative h-[100svh]">
				<GlobalSearch />

				<div className="absolute bottom-8 left-0 right-0 flex items-center justify-center z-50">
					<ScrollButton />
				</div>
			</Hero>
			<div className="relative">
				<StarsAnimation className={"absolute h-full w-full"} />

				<TopProviders className="mt-32 lg:mt-52" />

				<section className="container mt-20 sm:mt-24 md:mt-40 mb-28 relative z-50">
					<CashbackBanner />
				</section>

				<section className="relative container text-center">
					<CircularGlow className="hidden md:block -left-1/2" />
					<CircularGlow className="hidden md:block -right-1/2" />
					<CircularGlow className="block md:hidden -top-0 -translate-y-1/2" />
					<CategoriesExplore />
				</section>

				<section className="container text-center mt-28 mb-[4.5rem] relative">
					<div className="relative">
						<Heading as="h2" className="max-w-[20ch] mx-auto">
							Why <GradientText>CONST3LLATION</GradientText> is your trusted
							Web3 partner
						</Heading>
						<CircularGlow className="left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
					</div>
					<div className="mt-12 sm:mt-16 md:mt-[4.5rem] flex flex-col sm:grid sm:grid-cols-2 sm:grid-rows-2 gap-6 relative">
						<FeatureCard
							title="Vetted Partners"
							description="Every partner on our platform is thoroughly reviewed to ensure they’re industry leaders, so you don’t have to second-guess."
							image={<AnimatedShieldIcon />}
							className="relative z-10"
						/>
						<FeatureCard
							title="Comprehensive Services"
							description="From marketing to legal, find agencies offering every service a web3 project needs."
							image={<DiamondIconAnimation />}
							className="relative z-10"
						/>
						<FeatureCard
							title="Transparent Reviews & Ratings"
							description="See what other web3 companies have to say about working with each service provider"
							image={<MessageIconAnimation />}
							className="relative z-10"
						/>
						<FeatureCard
							title="Global Networks"
							description="Find solutions that serve clients around the world, no matter your location or project scale."
							image={<GlobeIconAnimation />}
							className="relative z-10"
						/>
					</div>
				</section>

				<section className="container sm:mt-16 mb-32 sm:mb-40 md:mb-52">
					<PartnersBanner />
				</section>

				<NewsletterSection />
			</div>
		</main>
	);
}
