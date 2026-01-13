import StarsAnimation from "@/app/(web)/stars-animation";
import CreateReviewForm from "@/features/service-providers/components/forms/review/create-review-form";
import { Suspense } from "react";
type Props = {
	params: Promise<{ slug: string }>;
};

export default async function CreateReviewPage({ params }: Props) {
	const { slug } = await params;

	return (
		<Suspense>
			<main className="py-56 relative">
				<StarsAnimation className="-z-50" />
				<div className="container text-text-100 h-full">
					<CreateReviewForm slug={slug} />
				</div>
			</main>
		</Suspense>
	);
}
