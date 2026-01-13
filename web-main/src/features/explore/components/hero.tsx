import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";

const Hero = () => {
	return (
		<div className="container pt-56 pb-28 relative h-full flex flex-col justify-center">
			<Heading as="h1" className="text-center">
				Results for Your Search Query
			</Heading>
			<Body
				variants="18-medium"
				className="text-center mt-6 text-text-200 max-w-[770px] mx-auto"
			>
				We connect Web3 projects with top-tier service providers. Search, find,
				and collaborate with trusted partners who are verified experts in
				driving results.
			</Body>
			<div
				className="w-full max-w-[940px] h-[323px] bg-contain bg-no-repeat bg-bottom mx-auto absolute bottom-0 left-0 right-0"
				style={{
					backgroundImage: "url('/explore/explore-hero.webp')",
				}}
			/>
		</div>
	);
};

export default Hero;
