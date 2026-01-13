import StarsAnimation from "@/app/(web)/stars-animation";
import Accordion from "@/components/accordion";
import NewsletterSection from "@/components/newsletter";
import { Body } from "@/components/ui/body";
import { ButtonLink } from "@/components/ui/button-link";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";

export default function HelpCenterPage() {
	return (
		<main className="relative">
			<StarsAnimation className="-z-50" />
			<section className="mt-44 lg:mt-56 flex flex-col gap-3">
				<Body variants="16-bold" className="mx-auto text-primary-100">
					FAQs
				</Body>
				<Heading
					as="h1"
					variants={{ mobile: "h2", tablet: "h2", desktop: "h1" }}
					className="mx-auto capitalize text-center"
				>
					We’ve got the answers
				</Heading>
			</section>
			<section className="container text-center mt-20 lg:mt-36 mb-16 lg:mb-20 max-w-4xl">
				<Accordion />
			</section>
			<section className="container text-center mb-52">
				<div className="bg-background-input pt-8 pb-10 rounded-2xl">
					<div className="w-[52px] h-[52px] bg-gradient-3 rounded-lg mx-auto flex items-center justify-center shadow-icon">
						<Icon
							name="Sparkles"
							width={28}
							height={28}
							className="text-text-100"
						/>
					</div>
					<div className="flex flex-col gap-2 my-8">
						<Heading
							as="h4"
							className="mx-auto text-2xl leading-5 font-semibold"
						>
							Still need help
						</Heading>
						<Body variants="18-medium" className="text-text-200">
							If you can't find the answers you need, reach out to our support
							team. <br />
							We’re here to help.
						</Body>
					</div>
					<ButtonLink href="/contact" variant="primary" size="md">
						<Body variants="14-medium" className="text-text-200">
							Submit a Support Ticket
						</Body>
					</ButtonLink>
				</div>
			</section>
			<NewsletterSection />
		</main>
	);
}
