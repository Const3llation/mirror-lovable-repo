import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";
import { useMemo } from "react";

interface SubCategory {
	id: number;
	name: string;
}

interface Service {
	id: number;
	name: string;
	subCategories?: SubCategory[];
}

interface ServiceListCardProps {
	service: Service;
}

const ServiceListCard = ({ service }: ServiceListCardProps) => {
	const subServices = useMemo(
		() => service.subCategories || [],
		[service.subCategories],
	);

	return (
		<div className="p-5 flex flex-col gap-5 min-h-[300px] bg-[#0300147D]">
			<div className="border border-white/15 rounded-lg w-10 h-10 bg-gradient-4 flex items-center justify-center">
				<Icon
					name={service.icon}
					width={20}
					height={20}
					className="text-text-100"
				/>
			</div>
			<div className="flex flex-col gap-5 h-full">
				<Link
					href={`/explore/${service.slug}`}
					className="hover:text-primary-100 text-text-100 hover:underline transition-colors duration-200 text-left shrink-0"
				>
					<Body variants="16-medium">{service.name}</Body>
				</Link>

				<ul className="flex flex-col gap-2 flex-1 overflow-y-auto">
					{subServices.map((subService) => (
						<li key={subService.id} className="flex gap-1">
							<span className="text-text-300">&bull;</span>
							<Link
								href={`/explore?subService=${subService.slug}`}
								className=" hover:text-primary-100 text-text-300 hover:underline transition-colors duration-200 text-left"
							>
								<Body variants="16-medium">{subService.name}</Body>
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};
export default ServiceListCard;
