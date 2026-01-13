import SpaceAnimation from "@/app/(web)/space-animation";
import { GradientText } from "@/components/gradient-text";
import NewsletterSection from "@/components/newsletter";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import Image from "next/image";
import { HomeButton } from "./not-found-home-button";

const NotFoundPage = () => {
	return (
		<div className="flex flex-col px-4 md:px-8 lg:px-0 relative">
			<SpaceAnimation className="-z-50" />
			<section className="flex-1 flex flex-col items-center justify-center text-text-100 min-h-[80svh] lg:min-h-auto pt-44">
				<Image
					src="/404/404-illustration.webp"
					alt="404 illustration"
					width={656}
					height={379}
					className="w-full max-w-[656px]"
				/>
				<Heading as="h1" className="mb-6">
					<GradientText>Page Not Found</GradientText>
				</Heading>
				<Body variants="20-medium" className="text-text-300 mb-16 text-center">
					The page you are looking for might have been removed or is temporarily
					unavailable.
				</Body>

				<HomeButton />
			</section>
			<NewsletterSection />
		</div>
	);
};

export default NotFoundPage;
