import ServiceProviderRating from "@/components/ServiceProviderRating";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import Findings from "@/features/service-providers/components/profile/findings";
import HighlightHeader from "@/features/service-providers/components/profile/highlight-header";
import HighlightItem from "@/features/service-providers/components/profile/highlight-item";
import SocialIconLink from "@/features/service-providers/components/profile/social-icon-link";
import TeamMember from "@/features/service-providers/components/profile/team-member";
import TeamMembersMobile from "@/features/service-providers/components/profile/team-members-mobile";
import type {
	ImageUpload,
	RemoteFileUpload,
	TeamMember as TTeamMember,
} from "@/types/payload";
import isNotEmpty from "@/utils/is-not-empty";

export type SocialNetwork =
	| "linkedin"
	| "twitter"
	| "youtube"
	| "facebook"
	| "instagram"
	| "behance"
	| "github"
	| "customWeb";

export type SocialMedia = {
	[key in SocialNetwork]: string;
};

type FindingsItem = {
	id: string;
	title: string;
	text: string;
};

export type HighlightsProps = {
	slug: string;
	isPreview?: boolean;
	isVerified: boolean;
	logo: ImageUpload | RemoteFileUpload | File;
	providerName: string;
	foundedYear: string;
	location: string;
	companySize: string;
	minimumBudget: string;
	websiteUrl: string;
	socialMediaLinks: SocialMedia;
	description: string;
	teamMembers: TTeamMember[];
	totalRating?: number;
	findings?: FindingsItem[] | null;
};

export default function Highlights({
	slug,
	isPreview,
	isVerified,
	logo,
	providerName,
	foundedYear,
	location,
	companySize,
	minimumBudget,
	websiteUrl,
	socialMediaLinks,
	description,
	teamMembers,
	totalRating,
	findings,
}: HighlightsProps) {
	return (
		<div
			className="flex flex-col w-full rounded-lg"
			style={{
				background: `
                linear-gradient(0deg, #06041033, #06041033),
                linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
                radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
			}}
		>
			<HighlightHeader
				{...{
					slug,
					isPreview,
					isVerified,
					logo,
					providerName,
					websiteUrl,
					socialMediaLinks,
					foundedYear,
					location,
					companySize,
					minimumBudget,
					description,
					teamMembers,
					findings,
				}}
			/>
			<div className="w-full p-10 bg-background-input grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 border-y border-stroke-300">
				<HighlightItem
					key="founded-year"
					icon="Found"
					title="Founded year"
					value={foundedYear}
				/>
				<HighlightItem
					key="location"
					icon="Pin"
					title="Location"
					value={location}
				/>
				<HighlightItem
					key="company-size"
					icon="TeamMember"
					title="Company size"
					value={companySize}
				/>
				<HighlightItem
					key="minimum-budget"
					icon="EarnMoney"
					title="Minimum budget"
					value={minimumBudget}
				/>
			</div>
			<div className="flex flex-col gap-10 align-middle md:flex-row md:justify-between p-6 lg:p-10 w-full">
				<div className="flex flex-col gap-2 w-full max-w-2xl flex-1">
					<Body variants="12-regular" className="text-text-300">
						Description
					</Body>
					<Body variants="16-regular" className="text-text-100">
						{description}
					</Body>
				</div>
				<div className="w-full flex flex-col gap-9 md:w-52 lg:w-72">
					<ServiceProviderRating rating={totalRating} isVerified={isVerified} />
					<div className="flex flex-col gap-4 p-4 border border-stroke-5 rounded-lg bg-background-black-5">
						<Body variants="12-regular" className="text-text-300">
							Social media
						</Body>
						<div className="flex flex-row gap-4 flex-wrap">
							{Object.entries(socialMediaLinks)
								.map(([name, url]) => ({ name, url }))
								.filter(({ url }) => url)
								.map((socialMediaLink) => (
									<SocialIconLink
										key={`social-media-${socialMediaLink.name}`}
										type={socialMediaLink.name as SocialNetwork}
										url={socialMediaLink.url}
									/>
								))}
						</div>
					</div>
				</div>
			</div>
			{!isPreview && isNotEmpty(findings) && (
				<div className="flex flex-col gap-10 align-middle md:flex-row md:justify-between p-6 lg:p-10 w-full bg-primary-300">
					<div className="flex flex-col gap-2 w-full max-w-2xl flex-1">
						<Body variants="12-regular" className="text-text-300">
							Our vision
						</Body>
						<div className="flex flex-col gap-4">
							{findings.map((item) => (
								<div key={item.id} className="flex flex-col gap-1">
									<Body variants="16-bold" className="text-text-100">
										{item.title}
									</Body>
									<Body variants="16-regular" className="text-text-100">
										{item.text}
									</Body>
								</div>
							))}
						</div>
					</div>
					<div className="w-full flex flex-col gap-9 md:w-52 lg:w-72">
						<Findings />
					</div>
				</div>
			)}
			<div className="flex flex-col gap-8 bg-background-black-11 border border-stroke-5 rounded-b-lg px-4 py-6 md:p-6 lg:p-10">
				<Heading variants="h5" className="text-text-200">
					Team members
				</Heading>
				<div
					className="hidden md:grid md:grid-cols-5 md:gap-4"
					style={{
						gridTemplateColumns: `repeat(${teamMembers.length > 5 ? 5 : teamMembers.length}, 1fr)`,
					}}
				>
					{teamMembers.slice(0, 5).map((teamMember) => (
						<TeamMember key={teamMember.name} {...teamMember} />
					))}
				</div>
				<div className="block md:hidden">
					<TeamMembersMobile items={teamMembers} />
				</div>
			</div>
		</div>
	);
}
