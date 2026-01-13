import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";

const EMAIL_ADDRESS = "support@const3llation.com";

const ContactUs = () => {
	return (
		<div className="container">
			<div className="flex flex-col items-center p-4 md:p-8 bg-background-input rounded-2xl">
				<div className="flex items-center justify-center w-12 h-12 rounded-lg text-text-100 bg-gradient-3 mb-8">
					<Icon name="Sparkles" aria-hidden="true" />
				</div>
				<Heading as="h4">Contact Us</Heading>
				<Body
					variants="18-medium"
					className="text-center mt-6 text-text-200 max-w-[770px] mx-auto"
				>
					For any questions or concerns about your privacy, please contact us at
					<br />
					<a
						className="text-sm lg:text-base text-text-100 hover:text-primary-200 transition-colors inline-flex md:py-3"
						href={`mailto:${EMAIL_ADDRESS}`}
					>
						<span>{EMAIL_ADDRESS}</span>
					</a>
					.
				</Body>
			</div>
		</div>
	);
};

export default ContactUs;
