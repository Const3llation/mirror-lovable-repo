"use client";

import TeamMember from "@/features/service-providers/components/profile/team-member";
import type { TeamMember as TTeamMember } from "@/types/payload";
import useEmblaCarousel from "embla-carousel-react";

type Props = {
	items: TTeamMember[];
};

export default function TeamMembersMobile({ items }: Props) {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: false,
		slidesToScroll: 1,
	});

	return (
		<div
			className="w-full relative flex-1 flex flex-row overflow-hidden"
			ref={emblaRef}
		>
			<div className="w-full flex">
				{items.map((item) => (
					<div className="w-36 mr-2 flex-none" key={`${item.name}-mobile`}>
						<TeamMember {...item} />
					</div>
				))}
			</div>
		</div>
	);
}
