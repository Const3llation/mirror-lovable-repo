import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import { InfoTooltip } from "@/components/ui/info-icon";

type Props = {
	rating?: number | null | undefined;
	isVerified?: boolean;
};

const ServiceProviderRating = ({ rating, isVerified }: Props) => {
	return (
		<div>
			{isVerified ? (
				<>
					<div className="flex items-center gap-1 rounded-tl-lg rounded-tr-lg border-t border-r border-l border-white/5  bg-background-300 p-3 justify-center">
						<Icon
							name="Star"
							width={14}
							height={14}
							className="text-status-yellow-100"
						/>
						<Body variants="16-bold" className="text-text-100 font-medium">
							{rating ?? "-"}
						</Body>
						<Body variants="14-regular" className="text-text-300">
							Clients rating
						</Body>
						<InfoTooltip
							content="Average rating from verified client reviews. Each review is submitted post-project completion and verified before publication. Rating reflects overall client satisfaction across all completed projects."
							iconClassName="text-text-300 ml-1"
						/>
					</div>
					<div className="flex items-center gap-1 rounded-bl-lg border-b border-r border-l border-white/20  rounded-br-lg bg-status-green-200 p-3 justify-center">
						<Icon
							name="BadgeCheck"
							width={14}
							height={14}
							className="text-status-green-100"
						/>
						<Body variants="14-medium" className=" text-text-100">
							CONST3LLATION Verified
						</Body>

						<InfoTooltip
							content="This provider has passed our comprehensive multi-step audit process, verifying their expertise, performance track record, and compliance standards. Only top-tier providers earn this status"
							iconClassName="text-text-300 ml-1"
						/>
					</div>
				</>
			) : (
				<>
					<div className="flex items-center gap-1 rounded-tl-lg rounded-tr-lg border-t border-r border-l border-white/5  bg-background-input p-3 justify-center">
						<Icon
							name="Star"
							width={14}
							height={14}
							className="text-status-yellow-100"
						/>
						<Body variants="16-bold" className="text-text-100 font-medium">
							{rating ?? "-"}
						</Body>
						<Body variants="14-regular" className="text-text-300">
							Clients rating
						</Body>
						<InfoTooltip
							content="Average rating from verified client reviews. Each review is submitted post-project completion and verified before publication. Rating reflects overall client satisfaction across all completed projects."
							iconClassName="text-text-300 ml-1"
						/>
					</div>
					<div className="flex items-center gap-1 rounded-bl-lg border-b border-r border-l border-white/20  rounded-br-lg bg-background-100 p-3 justify-center">
						<Body variants="14-medium" className=" text-text-100">
							Not CONST3LLATION Verified
						</Body>

						<InfoTooltip
							content="This provider has not gone through audit process. We cannot guarantee the expertise, performance track record, or compliance standards with them."
							iconClassName="text-text-300 ml-1"
						/>
					</div>
				</>
			)}
		</div>
	);
};

export default ServiceProviderRating;
