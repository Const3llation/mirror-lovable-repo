"use client";

import { Body } from "@/components/ui/body";
import { Icon, type IconName } from "@/components/ui/icon";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useMemo } from "react";

interface SubCategory {
	id: number;
	name: string;
}

interface Service {
	id: number;
	name: string;
	icon: IconName;
	subCategories?: SubCategory[];
}

interface ServiceListCardProps {
	service: Service;
	isExpanded: boolean;
	onToggle: () => void;
}

const ServiceListCardMobile = ({
	service,
	isExpanded,
	onToggle,
}: ServiceListCardProps) => {
	const subServices = useMemo(
		() => service.subCategories || [],
		[service.subCategories],
	);

	return (
		<div className="flex flex-col border border-stroke-50 rounded-xl overflow-hidden bg-[#0300147D]">
			<div
				className="flex justify-between items-center p-4 cursor-pointer"
				onClick={onToggle}
				aria-expanded={isExpanded}
			>
				<div className="flex gap-4 items-center">
					<div className="border border-white/15 rounded-lg w-10 h-10 bg-gradient-4 flex items-center justify-center">
						<Icon
							name={service.icon}
							width={20}
							height={20}
							className="text-text-100"
						/>
					</div>
					<div className="text-left text-text-100">
						<Body variants={"16-medium"}>{service.name}</Body>
					</div>
				</div>
				<div className="relative w-8 h-8">
					<motion.div
						className="absolute top-0"
						style={{ transformOrigin: "50% 50%" }}
						initial={{ opacity: 0, rotate: -90 }}
						animate={{
							opacity: isExpanded ? 1 : 0,
							rotate: isExpanded ? 0 : 90,
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<Icon name="CircleMinus" className="text-primary-100" />
					</motion.div>
					<motion.div
						className="absolute top-0"
						style={{ transformOrigin: "50% 50%" }}
						initial={{ opacity: 1, rotate: 0 }}
						animate={{
							opacity: isExpanded ? 0 : 1,
							rotate: isExpanded ? -90 : 0,
						}}
						transition={{ duration: 0.3, ease: "easeInOut" }}
					>
						<Icon name="CirclePlus" className="text-primary-100" />
					</motion.div>
				</div>
			</div>
			<AnimatePresence>
				{isExpanded && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div className="flex flex-col gap-5 px-4 py-2 bg-background-input">
							<ul className="flex flex-col flex-1 items-start">
								{subServices.map((subService) => (
									<li
										key={subService.id}
										className="border-b border-stroke-25 last:border-b-0 w-full text-left"
									>
										<Link
											href={`/explore&subService=${subService.id}`}
											className="text-text-100 text-base w-full py-4 inline-flex items-center justify-between"
										>
											<Body variants="16-medium">{subService.name}</Body>
											<Icon name="ArrowRight" width={18} height={15} />
										</Link>
									</li>
								))}
							</ul>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ServiceListCardMobile;
