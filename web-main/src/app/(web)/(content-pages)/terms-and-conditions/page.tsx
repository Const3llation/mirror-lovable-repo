import ContentPageTemplate from "@/components/content-page-template";
import NewsletterSection from "@/components/newsletter";

import "@/styles/rich-text.css";

export default async function TermsAndConditionsPage() {
	return (
		<div>
			<div className="container max-w-screen-lg flex flex-col items-center justify-center pb-0 pt-56 mb-32 sm:mb-40 md:mb-52">
				<ContentPageTemplate
					slug="terms-and-conditions"
					className="rich-text-component"
				/>
			</div>
			<NewsletterSection />
		</div>
	);
}
