import StarsAnimation from "@/app/(web)/stars-animation";
import CircularGlow from "@/components/circular-glow";
import CreateContactForm from "@/features/service-providers/components/forms/contact/create-contact-form";
import { Suspense } from "react";

type CreateServiceProviderContactPageProps = {
	params: Promise<{ slug: string }>;
};

export default async function CreateServiceProviderPage({
	params,
}: CreateServiceProviderContactPageProps) {
	const { slug } = await params;

	return (
		<Suspense>
			<main className="py-56 relative">
				<StarsAnimation className="-z-50" />
				<div className="container text-text-100 h-full relative">
					<CircularGlow className="-z-50 left-1/2 -translate-x-1/2 -translate-y-1/2" />
					<CircularGlow className="-z-50" />
					<CircularGlow className="-z-50 right-1/2 translate-x-full translate-y-full" />
					<CreateContactForm slug={slug} />
				</div>
			</main>
		</Suspense>
	);
}
