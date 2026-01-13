import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { VerificationBadge } from "@/features/home/components/service-provider-card";
import CashbackCta from "@/features/service-providers/components/profile/cashback-cta";
import type { HighlightsProps } from "@/features/service-providers/components/profile/highlights";
import SocialIconLink from "@/features/service-providers/components/profile/social-icon-link";
import getUploadDisplayUrl from "@/features/service-providers/utils/get-upload-display-url";
import Image from "next/image";
import Link from "next/link";

function HighLightHeaderMobile({
	isPreview,
	isVerified,
	logo,
	providerName,
	websiteUrl,
	socialMediaLinks,
	slug,
}: HighlightsProps) {
	return (
		<div className="flex flex-col justify-between w-full">
			<div className="flex flex-row gap-4 px-4 py-6">
				<div className="w-12 h-12 bg-background-input rounded-lg flex items-center justify-center border border-stroke-25 self-center">
					<Image
						src={
							getUploadDisplayUrl(logo) ??
							"https://via.assets.so/img.jpg?w=88&h=88"
						}
						width={88}
						height={88}
						alt="logo"
						className="rounded-lg"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex flex-col items-center gap-2 justify-start">
						<Body variants="18-medium" className="text-text-100">
							{providerName}
						</Body>
						<div className="flex flex-row gap-2 self-start">
							{!isPreview ? (
								<VerificationBadge isVerified={isVerified} />
							) : null}
							{!isPreview && !isVerified && (
								<Link href={`/providers/${slug}/verify`}>
									<Body
										variants="14-medium"
										className="text-primary-100 cursor-pointer underline"
									>
										Verify
									</Body>
								</Link>
							)}
						</div>
					</div>
				</div>
			</div>
			<div className="py-4 border-y border-stroke-300 w-full">
				<div className="w-full flex flex-row gap-2 justify-center">
					{socialMediaLinks.twitter && (
						<SocialIconLink
							type="twitter"
							url={socialMediaLinks.twitter}
							key="featured-twitter"
						/>
					)}
					{socialMediaLinks.linkedin && (
						<SocialIconLink
							type="linkedin"
							url={socialMediaLinks.linkedin}
							key="featured-linkedin"
						/>
					)}
					<Link href={websiteUrl} target="_blank">
						<Body className="text-primary-100 cursor-pointer underline">
							Visit website
						</Body>
					</Link>
				</div>
			</div>
			<div className="py-6 px-4">
				{!isPreview && <CashbackCta slug={slug} />}
			</div>
		</div>
	);
}

function HighLightHeaderTablet({
	isPreview,
	isVerified,
	logo,
	providerName,
	websiteUrl,
	socialMediaLinks,
	slug,
}: HighlightsProps) {
	return (
		<div className="flex flex-col justify-between w-full">
			<div className="px-4 py-6 flex flex-row justify-between">
				<div className="flex flex-row gap-4 align-top items-start">
					<div className="w-12 h-12 bg-background-input rounded-lg flex border border-stroke-25">
						<Image
							src={
								getUploadDisplayUrl(logo) ??
								"https://via.assets.so/img.jpg?w=88&h=88"
							}
							width={88}
							height={88}
							alt="logo"
							className="rounded-lg"
						/>
					</div>
					<div className="flex flex-col gap-2">
						<div className="flex flex-col items-center gap-2 justify-start">
							<Heading variants="h4" className="text-text-100">
								{providerName}
							</Heading>
							<div className="flex flex-row gap-2 self-start">
								{!isPreview ? (
									<VerificationBadge isVerified={isVerified} />
								) : null}
								{!isPreview && !isVerified && (
									<Link href={`/providers/${slug}/verify`}>
										<Body
											variants="14-medium"
											className="text-primary-100 cursor-pointer underline"
										>
											Verify
										</Body>
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
				<div>{!isPreview && <CashbackCta slug={slug} />}</div>
			</div>
			<div className="py-4 border-y border-stroke-300 w-full">
				<div className="w-full flex flex-row gap-2 justify-center">
					{socialMediaLinks.twitter && (
						<SocialIconLink
							type="twitter"
							url={socialMediaLinks.twitter}
							key="featured-twitter"
						/>
					)}
					{socialMediaLinks.linkedin && (
						<SocialIconLink
							type="linkedin"
							url={socialMediaLinks.linkedin}
							key="featured-linkedin"
						/>
					)}
					<Link href={websiteUrl} target="_blank">
						<Body className="text-primary-100 cursor-pointer underline">
							Visit website
						</Body>
					</Link>
				</div>
			</div>
		</div>
	);
}

function HighLightHeaderDesktop({
	slug,
	isPreview,
	isVerified,
	logo,
	providerName,
	websiteUrl,
	socialMediaLinks,
}: HighlightsProps) {
	return (
		<div className="flex flex-row justify-between p-10 w-full">
			<div className="flex flex-row gap-4">
				<div className="w-[88px] h-[88px] bg-background-input rounded-lg flex items-center justify-center border border-stroke-25">
					<Image
						src={getUploadDisplayUrl(logo)}
						width={88}
						height={88}
						alt="logo"
						className="rounded-lg"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="flex flex-row items-center gap-2">
						<Heading variants="h4">{providerName}</Heading>
						<div className="flex flex-row gap-2">
							{!isPreview ? (
								<VerificationBadge isVerified={isVerified} />
							) : null}
							{!isPreview && !isVerified && (
								<Link href={`/providers/${slug}/verify`}>
									<Body
										variants="14-medium"
										className="text-primary-100 cursor-pointer underline"
									>
										Verify
									</Body>
								</Link>
							)}
						</div>
					</div>
					<div className="flex flex-row gap-2">
						{socialMediaLinks.twitter && (
							<SocialIconLink
								type="twitter"
								url={socialMediaLinks.twitter}
								key="featured-twitter"
							/>
						)}
						{socialMediaLinks.linkedin && (
							<SocialIconLink
								type="linkedin"
								url={socialMediaLinks.linkedin}
								key="featured-linkedin"
							/>
						)}
						<Link href={websiteUrl} target="_blank">
							<Body className="text-primary-100 cursor-pointer underline">
								Visit website
							</Body>
						</Link>
					</div>
				</div>
			</div>
			{!isPreview && <CashbackCta slug={slug} />}
		</div>
	);
}

export default function HighlightHeader(props: HighlightsProps) {
	return (
		<>
			<div className="hidden lg:block">
				<HighLightHeaderDesktop {...props} />
			</div>
			<div className="block sm:hidden">
				<HighLightHeaderMobile {...props} />
			</div>
			<div className="hidden sm:block lg:hidden">
				<HighLightHeaderTablet {...props} />
			</div>
		</>
	);
}
