"use client";

import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import useHelpCenter from "@/features/help-center/hooks/use-help-center";
import { cn } from "@/utils/cn";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

const Accordion = () => {
	const { data: helpCenterItems, isLoading } = useHelpCenter();

	if (isLoading)
		return (
			<div className="flex flex-col gap-4 md:gap-6">
				{Array.from({ length: 7 }).map((_, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						className="w-full p-6 h-20 bg-background-input animate-pulse"
						aria-hidden="true"
					/>
				))}
			</div>
		);

	return (
		<div className="flex flex-col gap-4 lg:gap-6">
			{helpCenterItems?.docs?.map(
				(item: { title: string; content: string }) => (
					<AccordionItem
						key={item.title}
						title={item.title}
						description={item.content}
					/>
				),
			)}
		</div>
	);
};

interface AccordionItemProps {
	title: string;
	description: string;
}

const AccordionItem = ({ title, description }: AccordionItemProps) => {
	const [isExpanded, setIsExpanded] = useState(false);

	const onToggle = () => {
		setIsExpanded((prev) => !prev);
	};

	return (
		<div
			className={cn(
				"flex flex-row space-between rounded-xl overflow-hidden p-6",
				isExpanded ? "bg-background-input" : "none",
			)}
		>
			<div
				className="flex w-full flex-col gap-2 justify-between cursor-pointer"
				onClick={onToggle}
				aria-expanded={isExpanded}
			>
				<div className="text-left text-text-100">
					<Body variants={"20-medium"}>{title}</Body>
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
							<Body variants="16-regular" className="text-text-300 text-left">
								{description}
							</Body>
						</motion.div>
					)}
				</AnimatePresence>
			</div>

			<div className="relative w-8 h-8" onClick={onToggle}>
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
	);
};

export default Accordion;
