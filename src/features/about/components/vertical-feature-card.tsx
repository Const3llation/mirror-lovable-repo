"use client";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/utils/cn";
import { useEffect, useRef } from "react";

interface VerticalFeatureCardProps {
	title: string;
	description: string;
	image?: React.ReactNode;
	className?: string;
	horizontal?: boolean;
}

const VerticalFeatureCard = ({
	title,
	description,
	image,
	className,
	horizontal,
}: VerticalFeatureCardProps) => {
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
		<div
			ref={containerRef}
			className={cn(
				"relative group/card h-full",
				horizontal ? "md:col-span-2 lg:col-span-1" : "md:col-span-1",
			)}
		>
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
					"relative m-[1px] p-5 rounded-xl h-full",
					"bg-[#030014]",
					"flex flex-col overflow-hidden",
					horizontal && "md:flex-row lg:flex-col",
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
					<div
						className={cn(
							"mx-auto relative z-10",
							horizontal &&
								"md:mr-5 md:ml-0 lg:mx-auto flex items-center justify-center",
						)}
					>
						{image}
					</div>
				)}

				<div
					className={cn(
						"flex flex-col gap-3 mt-auto flex-1 h-fit self-center relative z-10",
						horizontal ? "md:mt-0 md:self-center lg:mt-auto" : "mt-auto",
					)}
				>
					<Heading
						as="h3"
						variants={"h5"}
						className={cn(
							"text-text-100 text-center",
							horizontal && "md:text-left lg:text-center",
						)}
					>
						{title}
					</Heading>
					<Body
						variants="16-regular"
						className={cn(
							"text-text-300 text-center",
							horizontal && "md:text-left lg:text-center",
						)}
					>
						{description}
					</Body>
				</div>
			</div>
		</div>
	);
};

export default VerticalFeatureCard;
