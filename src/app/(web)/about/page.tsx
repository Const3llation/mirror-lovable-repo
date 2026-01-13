import StarsAnimation from "@/app/(web)/stars-animation";
import DiamondIconAnimation from "@/components/animated-illustrations/animated-diamond-icon";
import GlobeIconAnimation from "@/components/animated-illustrations/animated-radial-globe-icon";
import MessageIconAnimation from "@/components/animated-illustrations/animated-radial-message-icon";
import AnimatedShieldIcon from "@/components/animated-illustrations/animated-shield-icon";
import SparklesIconAnimation from "@/components/animated-illustrations/animated-sparkles-icon";
import CircularGlow from "@/components/circular-glow";
import NewsletterSection from "@/components/newsletter";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import TeamMembers from "@/features/about/components/team-members";
import VerticalFeatureCard from "@/features/about/components/vertical-feature-card";
import FeatureCard from "@/features/home/components/feature-card";
import Image from "next/image";
import Link from "next/link";

export default function AboutUsPage() {
	return (
		<main className="relative">
			<CircularGlow className="left-1/2 -translate-x-1/2 -translate-y-full" />
			<StarsAnimation className="-z-50 top-[-100px]" />
			<section className="mt-72 flex flex-col gap-3 relative">
				<Body variants="16-bold" className="mx-auto text-primary-100">
					About Us
				</Body>
				<Heading as="h1" className="mx-auto capitalize text-center">
					Connecting Web3 Projects
					<br /> with Trusted Service Providers
				</Heading>
			</section>
			<section className="container">
				<div className="text-center mt-48 flex flex-col md:flex-row md:gap-14 items-center justify-center rounded-xl border border-stroke-25 p-24">
					<div className="flex-1 w-full md:basis-2/5">
						<SparklesIconAnimation size={220} />
					</div>
					<div className="flex flex-col gap-4 justify-center md:basis-3/5 text-left">
						<Heading as="h2" className="text-left">
							Our Mission
						</Heading>
						<Body className="text-text-300">
							At CONST3LLATION our mission is simple: to connect web3 projects
							with the most trusted service providers in the industry. Whether
							you’re looking for marketing, development, legal expertise, or any
							other service, we’re here to bridge the gap between innovative
							projects and the partners that make them successful.
						</Body>
					</div>
				</div>
			</section>
			<section className="container text-center mt-52 flex flex-col max-w-2xl gap-24">
				<div className="flex flex-col gap-6">
					<Heading as="h2" className="text-center">
						What We Do
					</Heading>
					<Body className="text-text-300">
						CONST3LLATION is a platform where web3 businesses can find and
						connect with vetted service providers, saving you time and helping
						you build the right partnerships. We vet every service provider,
						ensuring they meet our standards of professionalism and expertise,
						so you can focus on scaling your project with confidence.
					</Body>
				</div>
			</section>
			<div className="relative max-w-3xl mx-auto opacity-75 mt-20">
				<Image
					src="/connected-world.webp"
					alt="connected world"
					width={851}
					height={348}
					layout="responsive"
				/>
			</div>
			<section className="container text-center mt-60">
				<Heading as="h2" className="text-center">
					Why Choose Us?
				</Heading>
				<div className="mt-14 flex flex-col lg:grid lg:grid-cols-2 lg:grid-rows-2 lg:gap-14 gap-6 relative">
					<FeatureCard
						key="trusted-network"
						title="Trusted Network"
						description="Every service provider on our platform has been vetted for their industry expertise and proven track record."
						image={<AnimatedShieldIcon />}
						className="relative z-10"
					/>
					<FeatureCard
						key="comprehensive-services"
						title="Comprehensive Services"
						description="We offer a broad range of services, from KOL marketing to blockchain development, legal consultation, and more."
						image={<DiamondIconAnimation />}
						className="relative z-10"
					/>
					<FeatureCard
						key="cashback-rewards"
						title="Cashback Rewards"
						description="CONST3LLATION offers cashback for users who complete projects and leave reviews, ensuring our partners deliver top-tier results."
						image={<MessageIconAnimation />}
						className="relative z-10"
					/>
					<FeatureCard
						key="global-reach"
						title="Global Reach"
						description="No matter where your project is based, we have service providers that can help you, with expertise spanning across the globe."
						image={<GlobeIconAnimation />}
						className="relative z-10"
					/>
				</div>
			</section>
			<section className="container text-center mt-52 flex flex-col gap-16 relative">
				<CircularGlow className="left-1/2 -translate-x-1/2 -transate-y-1/2" />
				<CircularGlow className="left-1/2 -translate-x-1/2" />
				<Heading as="h2" className="text-center">
					Our values
				</Heading>
				<div className="flex flex-col md:grid md:grid-rows-2 md:grid-cols-2 lg:grid-rows-1 lg:grid-cols-3 gap-5 relative z-50">
					<VerticalFeatureCard
						key="integrity"
						title="Integrity"
						description="We only work with service providers who meet our high standards, ensuring trust and reliability."
						image={
							<Image
								src="/integrity.webp"
								alt="Integrity"
								width={130}
								height={150}
							/>
						}
					/>
					<VerticalFeatureCard
						key="innovation"
						title="Innovation"
						description="The web3 world is rapidly evolving, and so are we. We stay at the forefront of blockchain technology to bring you the best partners."
						image={
							<Image
								src="/innovation.webp"
								alt="Innovation"
								width={130}
								height={150}
							/>
						}
					/>
					<VerticalFeatureCard
						key="collaboration"
						title="Collaboration"
						description="We believe in the power of partnerships, working together with our clients and partners to foster mutual success."
						image={
							<Image
								src="/collaboration.webp"
								alt="Collaboration"
								width={130}
								height={150}
							/>
						}
						horizontal
					/>
				</div>
			</section>
			<section className="container text-center mt-52 flex flex-col gap-16 relative">
				<CircularGlow className="left-1/2 -translate-x-1/2 -translate-y-1/2" />
				<Heading as="h2" className="text-center capitalize">
					Team members
				</Heading>
				<TeamMembers />
			</section>
			<section className="container text-center my-52">
				<div
					className="border border-stroke-25 py-16 px-8 flex flex-col gap-8 rounded-2xl"
					style={{
						backgroundImage: `
						url('/about/ripple.webp'),
						linear-gradient(180deg, #3F338EFF 14.8%, #120D2B22 100%)
					`,
						backgroundRepeat: "no-repeat",
						backgroundPosition: "bottom",
						backgroundSize: "contain",
					}}
				>
					<div className="flex flex-col gap-4 mx-auto">
						<Heading as="h2" className="text-center capitalize">
							Ready to find the right
							<br /> partner for your web3 project?
						</Heading>
						<Body className="text-text-300">
							Explore our vetted service providers andtake your project to the
							next level.
						</Body>
					</div>
					<Link href="/explore" className="mx-auto w-fit">
						<Button variant="primary" size="md">
							<Body variants="16-regular" className="text-text-100">
								Explore now
							</Body>
						</Button>
					</Link>
				</div>
			</section>
			<NewsletterSection />
		</main>
	);
}
