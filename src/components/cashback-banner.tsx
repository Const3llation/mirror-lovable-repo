import { Body } from "@/components/ui/body";
import { ButtonLink } from "@/components/ui/button-link";
import { Heading } from "@/components/ui/heading";

type Props = {
	redirectTo?: string;
};

const CashbackBanner = ({ redirectTo = "/explore" }: Props) => {
	return (
		<div
			className="relative py-6 px-8 md:py-16 border border-stroke-25 rounded-2xl bg-cover bg-center bg-no-repeat"
			style={{
				backgroundImage: "url('/cashback-banner.webp')",
			}}
		>
			<div className="text-center">
				<Heading as="h2" className="text-text-100 mb-4">
					Leave a review and earn 5% cashback
				</Heading>
				<Body
					variants="20-medium"
					className="text-text-300 max-w-[40ch] mx-auto mb-8"
				>
					Book through Const3llation and{" "}
					<strong className="text-text-100">earn 5% cashback</strong> on your
					project budget when you share your experience.
				</Body>
				<ButtonLink href={redirectTo} variant="primary" size="lg">
					Leave review
				</ButtonLink>
			</div>
		</div>
	);
};

export default CashbackBanner;
