import { Icon, type IconName } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import { motion, useMotionValue, useTransform } from "motion/react";
import Image from "next/image";

type DialogHeadingIconProps = {
	className?: string;
	iconName: IconName;
};

export const DialogHeadingIcon = ({
	className,
	iconName,
}: DialogHeadingIconProps) => {
	// Create motion values for the mouse's X and Y offset from center
	const mouseX = useMotionValue(0);
	const mouseY = useMotionValue(0);

	// Increase multipliers for a more pronounced tilt effect.
	const rotateX = useTransform(mouseY, (value) => -value * 0.2);
	const rotateY = useTransform(mouseX, (value) => value * 0.2);

	// Parallax effect on the background image
	const translateX = useTransform(mouseX, (value) => value * 0.05);
	const translateY = useTransform(mouseY, (value) => value * 0.05);

	return (
		<motion.div
			className={cn(
				"relative aspect-[177/119] w-full overflow-hidden",
				className,
			)}
			onMouseMove={(e) => {
				const rect = e.currentTarget.getBoundingClientRect();
				const offsetX = e.clientX - rect.left - rect.width / 2;
				const offsetY = e.clientY - rect.top - rect.height / 2;
				mouseX.set(offsetX);
				mouseY.set(offsetY);
			}}
			onMouseLeave={() => {
				mouseX.set(0);
				mouseY.set(0);
			}}
			whileHover="hover"
			initial="initial"
		>
			{/* Background image with a parallax effect */}
			<motion.div
				className="absolute inset-0"
				style={{
					translateX,
					translateY,
					scale: 1.1,
				}}
				transition={{ duration: 0.3, ease: "easeOut" }}
			>
				<Image
					src="/grid.webp"
					alt=""
					fill
					priority
					className="object-contain scale-75"
					aria-hidden="true"
				/>
			</motion.div>

			<div className="flex items-center justify-center w-full h-full relative">
				{/* Background glow effect */}
				<motion.div
					className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-700/20 blur-xl"
					variants={{
						initial: { scale: 1 },
						hover: {
							scale: 1.15,
							transition: { duration: 0.2, ease: "easeInOut" },
						},
					}}
				/>

				{/* Icon with a stronger tilt effect */}
				<motion.div
					className="flex items-center justify-center w-14 h-14 rounded-lg text-text-100 bg-gradient-3 relative"
					style={{
						transformPerspective: 1000,
						rotateX: rotateX,
						rotateY: rotateY,
					}}
					variants={{
						initial: { scale: 1 },
						hover: {
							scale: 1.05,
							transition: { duration: 0.3, ease: "easeInOut" },
						},
					}}
				>
					<Icon name={iconName} aria-hidden="true" />
				</motion.div>
			</div>
		</motion.div>
	);
};
