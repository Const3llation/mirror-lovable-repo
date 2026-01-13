import CircularGlow from "@/components/circular-glow";
import PartnersBanner from "@/components/partners-banner";
import Highlights, {
	type HighlightsProps,
} from "@/features/service-providers/components/profile/highlights";
import Portfolio, {
	type PortfolioProps,
} from "@/features/service-providers/components/profile/portfolio";
import { ProfilePreviewBanner } from "@/features/service-providers/components/profile/profile-preview-banner";
import Reviews, {
	type ReviewProps,
} from "@/features/service-providers/components/profile/reviews";
import Services, {
	type ServiceProps,
} from "@/features/service-providers/components/profile/services";
import { cn } from "@/utils/cn";
import isNotEmpty from "@/utils/is-not-empty";
type Props = {
	isPreview?: boolean;
	highlights?: HighlightsProps;
	services?: ServiceProps;
	portfolio?: PortfolioProps;
	reviews?: ReviewProps;
	className?: string;
	onPrevious?: () => void;
	onSubmit?: () => void;
};

export default function ProviderProfile({
	isPreview,
	highlights,
	services,
	portfolio,
	reviews,
	className,
	onPrevious,
	onSubmit,
}: Props) {
	return (
		<div className={cn("flex flex-col gap-11 container", className)}>
			{isPreview && onPrevious && onSubmit && (
				<ProfilePreviewBanner onPrevious={onPrevious} onSubmit={onSubmit} />
			)}
			{highlights && (
				<div className="relative">
					<CircularGlow className="-z-50 left-full translate-y-1/2" />
					<div className="relative">
						<Highlights isPreview={isPreview} {...highlights} />
					</div>
				</div>
			)}
			{portfolio && isNotEmpty(portfolio.items) && (
				<div className="relative">
					<CircularGlow className="-z-50 right-full" />
					<div className="relative">
						<Portfolio isPreview={isPreview} {...portfolio} />
					</div>
				</div>
			)}
			{services && (
				<div className="relative">
					<CircularGlow className="-z-50 left-full" />
					<div className="relative">
						<Services {...services} />
					</div>
				</div>
			)}
			{reviews && <Reviews {...reviews} />}
			{!isPreview && <PartnersBanner />}
		</div>
	);
}
