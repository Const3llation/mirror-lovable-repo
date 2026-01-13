"use client";

import { GradientText } from "@/components/gradient-text";
import { Heading } from "@/components/ui/heading";
import { cn } from "@/utils/cn";
import Image from "next/image";
import { useState } from "react";

export const Hero = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	const [isLoaded, setIsLoaded] = useState(false);

	const handleImageLoad = () => {
		setIsLoaded(true);
	};

	return (
		<div className={cn("pb-64 pt-56 relative overflow-hidden", className)}>
			<div className="container flex flex-1 flex-col items-center justify-center h-full">
				<Heading as="h1" className="text-center font-medium mb-16">
					<GradientText>
						Find Industry-Leading Partners
						<span className="block">For Your Web3 Business</span>
					</GradientText>
				</Heading>
				{children}

				<Image
					src="/earth.webp"
					alt="Earth"
					onLoadingComplete={handleImageLoad}
					className="hidden"
					loader={({ src }) => src}
					priority
					width={0}
					height={0}
				/>
				<div className="absolute bottom-0 md:bottom-0 left-0 right-0 flex items-center justify-center w-full h-64 overflow-hidden z-40 container">
					<div
						className={cn(
							"w-full h-full relative",
							isLoaded ? "block animate-slideUp-2" : "hidden",
						)}
					>
						<div
							className="w-full aspect-square absolute rounded-full animate-spin-slow"
							style={{
								backgroundImage: "url(/earth.webp)",
								backgroundPosition: "top center",
								backgroundSize: "contain",
							}}
						/>
					</div>
				</div>
			</div>
			<div className="absolute bottom-0 left-0 right-0 flex items-center justify-center w-full h-56 container z-30">
				<div
					className={cn(
						"w-full h-full relative",
						isLoaded ? "block animate-slideUp" : "hidden",
					)}
				>
					<div
						className={"w-full aspect-square absolute rounded-full rotate-45"}
						style={{
							boxShadow: "0px 0px 1000px 100px #BA9DF5",
							filter: "blur(200px)",
						}}
					/>
				</div>
			</div>
			<div
				className={cn(
					"absolute bottom-0 left-0 right-0 w-full h-44 z-40",
					isLoaded ? "animate-slideUp-2 block" : "hidden",
				)}
				style={{
					background:
						"linear-gradient(180deg, rgba(0, 0, 0, 0) 40.68%, #030014 100%)",
				}}
			>
				&nbsp;
			</div>
		</div>
	);
};
