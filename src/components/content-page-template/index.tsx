import RichText from "@/components/rich-text";
import { Heading } from "@/components/ui/heading";
import { useContentPage } from "@/hooks/use-content-page";
import ContactUs from "../contact-us";

interface ContentPageTemplateProps {
	slug: string;
	className?: string;
}

export default async function ContentPageTemplate({
	slug,
	className = "",
}: ContentPageTemplateProps): Promise<JSX.Element> {
	const data = await useContentPage(slug);

	const { title, richText } = data || {};

	return (
		<main>
			<div className="flex flex-col items-center justify-center">
				<Heading as="h1" className="text-left font-medium mb-4 w-full">
					{title}
				</Heading>
				{richText && <RichText className={className} data={richText} />}
				<section className="container text-center pt-20 mb-14 relative">
					<ContactUs />
				</section>
			</div>
		</main>
	);
}
