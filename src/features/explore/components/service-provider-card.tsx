import ServiceProviderRating from "@/components/ServiceProviderRating";
import { Badge } from "@/components/ui/badge";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { CategoriesSection } from "@/features/service-providers/components/forms/registration/categories-section";
import getUploadDisplayUrl from "@/features/service-providers/utils/get-upload-display-url";
import type { ServiceProvider } from "@/types/payload";

interface ServiceProviderCardProps {
	provider: ServiceProvider;
	onViewProfile: (slug: string) => void;
}

const ServiceProviderCard = ({
	provider,
	onViewProfile,
}: ServiceProviderCardProps) => {
	const isVerified = provider.visibility?.status === "Verified";

	const handleViewProfile = () => {
		if (provider.slug) {
			onViewProfile(provider.slug);
		}
	};

	const logoUrl =
		provider.logo &&
		typeof provider.logo === "object" &&
		"value" in provider.logo &&
		provider.logo.value &&
		typeof provider.logo.value === "object"
			? getUploadDisplayUrl(provider.logo)
			: null;

	return (
		<article
			className="flex flex-col border-stroke-25 bg-gradient-4 rounded-xl border overflow-hidden cursor-pointer"
			onClick={handleViewProfile}
		>
			<div className="py-8 px-10">
				<div className="flex flex-col gap-6 md:flex-row mb-9">
					<div className="flex gap-4">
						{logoUrl ? (
							<img
								src={logoUrl}
								alt={`${provider.providerName} logo`}
								className="w-20 h-20 object-contain rounded-lg"
							/>
						) : (
							<div className="w-20 h-20 border border-stroke-50 rounded-lg" />
						)}
						<div className="flex flex-col gap-2 items-start">
							<Heading as="h4" className="text-text-100">
								{provider.providerName}
							</Heading>
							<div>
								<Badge
									showBadge={isVerified}
									type={isVerified ? "green" : "default"}
								>
									{isVerified ? "Verified" : "Unverified"}
								</Badge>
							</div>
						</div>
					</div>
					<div className="md:ml-auto">
						<ServiceProviderRating
							rating={provider.reviewsAverage}
							isVerified={provider.visibility?.status === "Verified"}
						/>
					</div>
				</div>
				<div className="flex flex-col gap-8 md:flex-row md:gap-16">
					<div className="flex-1 text-left">
						<Body variants={"12-regular"} className="text-text-300 mb-2">
							Short description
						</Body>
						<Body variants={"16-regular"} className="text-text-100">
							{provider.providerShortDescription}
						</Body>
					</div>
					<div className="flex-shrink-0">
						<div className="text-left">
							<CategoriesSection
								categories={
									provider.categories?.categories?.filter(
										(
											category,
										): category is Extract<typeof category, { id: number }> =>
											typeof category === "object",
									) ?? []
								}
								subCategories={
									provider.categories?.subCategories?.filter(
										(
											subCategory,
										): subCategory is Extract<
											typeof subCategory,
											{ id: number }
										> => typeof subCategory === "object",
									) ?? []
								}
								includeChildrenCategories
								maxVisible={2}
							/>
							<div className="flex justify-end mt-8">
								<Button
									variant="primary"
									size="md"
									onClick={(e) => {
										e.stopPropagation();
										handleViewProfile();
									}}
									className="w-full md:w-auto"
								>
									View profile
								</Button>
							</div>
						</div>
					</div>
				</div>
			</div>
		</article>
	);
};

export default ServiceProviderCard;
