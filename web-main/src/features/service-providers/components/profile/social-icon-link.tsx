import { Icon, type IconName } from "@/components/ui/icon";
import type { SocialNetwork } from "@/features/service-providers/components/profile/highlights";
import Link from "next/link";

type Props = {
	type: SocialNetwork;
	url: string;
};

export default function SocialIconLink({ type, url }: Props) {
	const iconName: Record<SocialNetwork, IconName> = {
		linkedin: "LinkedInOutline",
		twitter: "X",
		youtube: "Youtube",
		facebook: "Facebook",
		instagram: "Instagram",
		behance: "Behance",
		github: "Github",
		customWeb: "Link",
	};

	return (
		<Link href={url} target="_blank">
			<div className="bg-gradient-3 w-6 h-6 rounded-s rounded-e flex items-center justify-center cursor-pointer shadow-icon">
				<Icon name={iconName[type]} className="text-white w-4 h-4" />
			</div>
		</Link>
	);
}
