import StarsAnimation from "@/app/(web)/stars-animation";
import CircularGlow from "@/components/circular-glow";
import NewsletterSection from "@/components/newsletter";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import ContactForm from "@/features/contact/components/contact-form";
import ContactInfo from "@/features/contact/components/contact-info";

export default function ContactPage() {
	return (
		<main className="relative">
			<CircularGlow className="left-1/2 -translate-x-1/2 -translate-y-full" />
			<StarsAnimation className="-z-50 top-[-100px]" />
			<section className="mt-56 flex flex-col gap-8 relative">
				<div className="flex flex-col gap-3">
					<Body variants="16-bold" className="mx-auto text-primary-100">
						Contact page
					</Body>
					<Heading as="h1" className="mx-auto capitalize text-center">
						We’d love to hear from you
					</Heading>
				</div>
				<Body
					variants="20-medium"
					className="mx-auto text-center text-text-200"
				>
					Our friendly team is always here to chat.
				</Body>
			</section>
			<section className="container mx-auto max-w-4xl relative">
				<div className="bg-background-base border border-stroke-50 mt-20 py-12 px-10 rounded-xl flex flex-col gap-14">
					<Heading as="h3" variants="h3" className="text-center">
						Contact form
					</Heading>
					<ContactForm />
				</div>
			</section>
			<section className="container mt-24 mb-32 sm:mb-40 md:mb-52">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
					<ContactInfo
						key="chat-to-sales"
						imageUrl="/contact/chat-to-sales.webp"
						title="Chat to sales"
						description="Speak to our friendly team."
						email="sales@const3llation.com"
					/>
					<ContactInfo
						key="chat-to-support"
						imageUrl="/contact/chat-to-support.webp"
						title="Chat to support"
						description="We’re here to help."
						email="support@const3llation.com"
					/>
				</div>
			</section>

			<NewsletterSection />
		</main>
	);
}
