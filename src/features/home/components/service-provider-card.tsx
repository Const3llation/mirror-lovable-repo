// @ts-nocheck

import ServiceProviderRating from "@/components/ServiceProviderRating";
import { Badge } from "@/components/ui/badge";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import IconBadge from "@/components/ui/icon-badge";
import { CategoriesSection } from "@/features/service-providers/components/forms/registration/categories-section";
import getUploadDisplayUrl from "@/features/service-providers/utils/get-upload-display-url";
import { cn } from "@/utils/cn";
import Link from "next/link";

export interface ServiceProvider {
	id: string;
	name: string;
	logo: string;
	rating: number;
	isVerified: boolean;
	foundedYear: number;
	companySize: string;
	categories: string[];
}

interface VerificationBadgeProps {
	isVerified: boolean;
}

export const VerificationBadge = ({ isVerified }: VerificationBadgeProps) => {
	if (!isVerified)
		return (
			<Badge type="default" showBadge={false}>
				Unverified
			</Badge>
		);

	return <Badge type="green">Verified</Badge>;
};

interface InfoItemProps {
	icon: React.ReactNode;
	label: string;
	value: string | number;
}

export const InfoItem = ({ icon, label, value }: InfoItemProps) => {
	return (
		<div className="flex gap-3 rounded-lg items-center bg-background-100 p-2 border border-white/5 w-full">
			<IconBadge size="md">{icon}</IconBadge>
			<div className="flex items-start flex-col">
				<Body variants="12-regular" className="text-text-300 text-nowrap">
					{label}
				</Body>
				<Body variants="14-bold" className="text-text-100 text-nowrap">
					{value}
				</Body>
			</div>
		</div>
	);
};

interface ServiceProviderCardProps {
	provider: unknown;
	className?: string;
}

export const ServiceProviderCard = ({
	provider,
	className,
}: ServiceProviderCardProps) => {
	return (
		<Link href={`/providers/${provider.slug}`} className="block h-full">
			<article
				className={cn(
					"pb-0 h-full flex flex-col bg-gradient-4 border border-stroke-25 rounded-xl cursor-pointer",
					className,
				)}
			>
				<div className="flex items-center gap-4 bg-[rgba(63,50,143,0.2)] rounded-t-xl p-6">
					{provider.logo ? (
						<img
							src={getUploadDisplayUrl(provider.logo)}
							alt={`${provider.providerName} logo`}
							className="w-20 h-20 object-contain rounded-lg"
						/>
					) : (
						<div className="w-16 h-16 rounded-lg bg-primary-300 flex-shrink-0" />
					)}
					<div className="flex flex-col items-start gap-2">
						<Body
							variants="18-medium"
							className="text-text-100 text-left leading-none lg:leading-normal"
						>
							{provider.providerName}
						</Body>
						<span>
							<VerificationBadge
								isVerified={provider.visibility.status === "Verified"}
							/>
						</span>
					</div>
				</div>

				<div className="p-6 flex-grow border-t border-stroke-25">
					{/* Ratings Section */}
					<div className="mb-6">
						<ServiceProviderRating
							rating={provider?.reviewsAverage ?? "-"}
							isVerified={provider.visibility?.status === "Verified"}
						/>
					</div>

					{/* Company Info Section */}
					<div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
						<InfoItem
							label="Founded year"
							value={provider.foundedYear}
							icon={
								<Icon
									name="Building"
									width={16}
									height={16}
									className="text-text-300"
								/>
							}
						/>
						<InfoItem
							label="Company size"
							value={provider.companySize}
							icon={
								<Icon
									name="People"
									width={32}
									height={32}
									className="text-text-300"
								/>
							}
						/>
					</div>

					<div className="mb-6">
						<CategoriesSection categories={provider.categories.categories} />
					</div>
				</div>

				<div className="py-6 bg-[rgba(3,0,20,0.5)] border-t border-stroke-25 rounded-b-xl p-6">
					<Button variant="secondary" size="md" fullWidth>
						View profile
					</Button>
				</div>
			</article>
		</Link>
	);
};
