"use client";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";

interface FeatureCardProps {
	title: string;
	description: string;
	image?: React.ReactNode;
	className?: string;
}

const FeatureCard = ({
	title,
	description,
	image,
	className,
}: FeatureCardProps) => {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const updateCursor = (e: PointerEvent) => {
			const rect = container.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;
			container.style.setProperty("--x", x.toString());
			container.style.setProperty("--y", y.toString());
		};

		container.addEventListener("pointermove", updateCursor);

		return () => {
			container.removeEventListener("pointermove", updateCursor);
		};
	}, []);

	return (
		<div ref={containerRef} className="relative group/card">
			<div
				className={cn(
					"absolute inset-0 rounded-xl",
					"bg-stroke-300",
					"before:absolute before:inset-0 before:rounded-xl",
					"before:bg-[radial-gradient(circle_at_calc(var(--x,50%)*1px)_calc(var(--y,50%)*1px),white,transparent_15vmin)]",
					"before:opacity-0",
					"group-hover/card:before:opacity-[0.15]",
					"after:absolute after:inset-0 after:rounded-xl",
					"after:bg-[radial-gradient(circle_at_calc(var(--x,50%)*1px)_calc(var(--y,50%)*1px),white,transparent_15vmin)]",
					"after:opacity-0",
					"group-hover/card:after:opacity-[0.3]",
					"after:transition-all after:duration-300",
					"before:transition-all before:duration-300",
					"before:content-[''] before:pointer-events-none",
					"after:content-[''] after:pointer-events-none",
				)}
			/>

			<div
				className={cn(
					"relative m-[1px] p-5 rounded-xl",
					"bg-[#030014]",
					"min-h-[300px] flex flex-col",
					"overflow-hidden",
				)}
			>
				{/* Glow effects container */}
				<div className="absolute inset-0 overflow-hidden pointer-events-none">
					<div
						className={cn(
							"absolute w-[400px] h-[400px]",
							"rounded-full bg-primary-300/25 blur-[80px]",
							"[background:radial-gradient(circle_at_top_right,theme(colors.primary.300)_0%,transparent_95%)]",
							"-right-1/3 -top-1/3",
							className,
						)}
					/>
					<div className="absolute w-[150px] h-[150px] -right-1/4 -top-1/4 bg-primary-300/30 rounded-full blur-[100px]" />
				</div>

				<div
					className={cn(
						"absolute inset-0 pointer-events-none",
						"before:absolute before:inset-0",
						"before:bg-[radial-gradient(circle_at_calc(var(--x,50%)*1px)_calc(var(--y,50%)*1px),theme(colors.primary.300/50%),transparent_15vmin)]",
						"before:opacity-0",
						"group-hover/card:before:opacity-100",
						"before:transition-all before:duration-300",
						"before:content-['']",
						"before:[mask:radial-gradient(12px_at_12px_12px,transparent_100%,black_100%)_-12px_-12px,radial-gradient(12px_at_calc(100%-12px)_12px,transparent_100%,black_100%)_12px_-12px,radial-gradient(12px_at_12px_calc(100%-12px),transparent_100%,black_100%)_-12px_12px,radial-gradient(12px_at_calc(100%-12px)_calc(100%-12px),transparent_100%,black_100%)_12px_12px,linear-gradient(black,black)]",
						"before:[mask-composite:intersect]",
					)}
				/>

				{image && (
					<div className="lg:absolute mx-auto lg:top-5 lg:right-5 w-[150px] h-[130px]">
						{image}
					</div>
				)}

				<div className="flex flex-col lg:text-left lg:pt-24 gap-3 mt-auto">
					<Heading as="h3" variants="h5">
						{title}
					</Heading>
					<Body variants="16-regular" className="text-text-300">
						{description}
					</Body>
				</div>
			</div>
		</div>
	);
};

export default FeatureCard;
