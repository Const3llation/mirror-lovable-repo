"use client";

import { Icon } from "@/components/ui/icon";
import { motion } from "motion/react";

export const ScrollButton = () => {
	return (
		<a
			href="#first-section"
			className="flex flex-col items-center gap-6 cursor-pointer group"
		>
			<span className="text-text-300 uppercase">Scroll down</span>
			<motion.span
				className="text-text-300 border border-text-300 rounded-full p-1.5 group-hover:bg-primary-300 transition-colors"
				animate={{
					y: [0, -10, 0],
				}}
				transition={{
					duration: 1.5,
					repeat: Number.POSITIVE_INFINITY,
					ease: "easeInOut",
				}}
			>
				<Icon name="ArrowDown" width={24} height={24} />
			</motion.span>
		</a>
	);
};
