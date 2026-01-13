"use client";

import { Body } from "@/components/ui/body";
import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import isNotEmpty from "@/utils/is-not-empty";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

type ServiceAccordionProps = {
	title: string;
	items: string[];
	icon: IconName;
};

export default function ServiceAccordion({
	title,
	items,
	icon,
}: ServiceAccordionProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	const onToggle = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<div className="flex flex-col space-between rounded-xl overflow-hidden border border-stroke-50">
			<div
				className="flex w-full flex-row justify-between items-center cursor-pointer p-4 bg-[#0300147D]"
				onClick={onToggle}
				aria-expanded={isExpanded}
			>
				<div className="flex flex-row gap-4">
					<div
						className="w-10 h-10 flex flex-col align-center items-center justify-center rounded-lg border border-stroke-5"
						style={{
							background:
								"linear-gradient(180deg, rgba(37, 29, 53, 0.57) 0%, rgba(108, 85, 155, 0.01) 100%)",
						}}
					>
						<Icon name={icon} className="w-5 h-5 text-text-100" />
					</div>
					<div className="text-left text-text-100 flex flex-col justify-center">
						<Body variants="16-medium">{title}</Body>
					</div>
				</div>
				<div
					className={cn(
						"relative w-8 h-8",
						isNotEmpty(items) ? "block" : "hidden",
					)}
					onClick={onToggle}
				>
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
						className="overflow-hidden bg-background-input px-4"
					>
						{items.map((item) => (
							<div
								key={item}
								className="flex flex-row justify-between py-6 border-b border-b-stroke-25"
							>
								<Body variants="16-regular" className="text-text-300 text-left">
									{item}
								</Body>
							</div>
						))}
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
}
