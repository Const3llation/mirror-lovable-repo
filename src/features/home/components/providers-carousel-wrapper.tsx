// @ts-nocheck

"use client";

import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";

interface CarouselProps {
	options?: unknown;
	className?: string;
	children: React.ReactNode;
	showControls?: boolean;
}

const CarouselButton = ({
	onClick,
	disabled,
	className,
	children,
}: {
	onClick: () => void;
	disabled: boolean;
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<button
			type="button"
			onClick={onClick}
			disabled={disabled}
			className={cn(
				"group flex h-[60px] w-[60px] text-text-100 items-center justify-center rounded-full",
				"border border-white/5 bg-background-100/80 backdrop-blur-sm",
				"hover:bg-background-100 hover:border-primary-100 disabled:opacity-0",
				"transition-all duration-400 ease-in-out",
				"hidden md:flex",
				className,
			)}
		>
			<div
				className={cn(
					"flex h-[40px] w-[40px] rounded-full items-center justify-center",
					"bg-gradient-to-b from-[rgba(11,8,27,0.76)] to-[rgba(43,40,54,1)]",
					"group-hover:from-[rgba(147,130,255,0.42)] group-hover:to-[rgba(147,130,255,0.42)]",
					"group-hover:scale-[1.06]",
					"transition-all duration-200 ease-out",
				)}
			>
				{children}
			</div>
		</button>
	);
};

export const ProvidersCarousel = ({
	options,
	className,
	children,
	showControls = true,
}: CarouselProps) => {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		...options,
	});

	const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
	const [nextBtnEnabled, setNextBtnEnabled] = useState(false);

	const scrollPrev = useCallback(() => {
		if (emblaApi) emblaApi.scrollPrev();
	}, [emblaApi]);

	const scrollNext = useCallback(() => {
		if (emblaApi) emblaApi.scrollNext();
	}, [emblaApi]);

	const onSelect = useCallback(() => {
		if (!emblaApi) return;
		setPrevBtnEnabled(emblaApi.canScrollPrev());
		setNextBtnEnabled(emblaApi.canScrollNext());
	}, [emblaApi]);

	useEffect(() => {
		if (!emblaApi) return;
		onSelect();
		emblaApi.on("select", onSelect);
		emblaApi.on("reInit", onSelect);
	}, [emblaApi, onSelect]);

	return (
		<div className={cn("relative flex w-full xl:gap-4", className)}>
			{showControls && (
				<div className="flex-shrink-0">
					<CarouselButton onClick={scrollPrev} disabled={!prevBtnEnabled}>
						<Icon name="ArrowLeft" className="h-5 w-5" />
					</CarouselButton>
				</div>
			)}

			<div className="flex-1 overflow-hidden min-w-0" ref={emblaRef}>
				<div className="flex">{children}</div>
			</div>

			{showControls && (
				<div className="flex-shrink-0">
					<CarouselButton onClick={scrollNext} disabled={!nextBtnEnabled}>
						<Icon name="ArrowRight" className="h-5 w-5" />
					</CarouselButton>
				</div>
			)}
		</div>
	);
};

export const ProvidersCarouselItem = ({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
}) => {
	return (
		<div className={cn("min-w-0 flex-shrink-0 flex-grow-0", className)}>
			{children}
		</div>
	);
};
