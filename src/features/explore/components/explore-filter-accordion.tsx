"use client";

import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";

type ExploreFilterAccordionProps = {
	title: string;
	isExpanded: boolean;
	onToggle: () => void;
	children: React.ReactNode;
	fixedHeight?: boolean;
};

const ExploreFilterAccordion = ({
	title,
	isExpanded,
	onToggle,
	children,
	fixedHeight = false,
}: ExploreFilterAccordionProps) => {
	return (
		<div className="flex flex-col border-b border-stroke-25">
			<div
				className={cn(
					"flex justify-between items-center p-4 cursor-pointer",
					isExpanded && "bg-background-input",
				)}
				onClick={onToggle}
				aria-expanded={isExpanded}
			>
				<Body variants={"18-medium"} className="text-text-100">
					{title}
				</Body>
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
						animate={{
							height: fixedHeight ? 300 : "auto",
							opacity: 1,
						}}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.2 }}
						className="overflow-hidden"
					>
						<div
							className={cn(
								"bg-background-input",
								fixedHeight ? "h-[300px] overflow-hidden" : "p-4",
							)}
						>
							{children}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ExploreFilterAccordion;
