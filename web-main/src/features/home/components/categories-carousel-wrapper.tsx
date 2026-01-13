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

export const CarouselButton = ({
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
				"flex h-10 w-10 text-text-100 items-center justify-center rounded-full",
				"border border-stroke-25 bg-background-100/80 backdrop-blur-sm",
				"hover:bg-[rgba(147,130,255,0.42)] disabled:opacity-0 transition-opacity",
				"hidden md:flex",
				"transition-all duration-200 ease-out",
				className,
			)}
		>
			{children}
		</button>
	);
};

export const CategoriesCarousel = ({
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
		<div className={cn("relative", className)}>
			<div className="overflow-hidden" ref={emblaRef}>
				<div className="flex">{children}</div>
			</div>
			{showControls && (
				<>
					<CarouselButton
						className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
						onClick={scrollPrev}
						disabled={!prevBtnEnabled}
					>
						<Icon name="ArrowLeft" className="h-4 w-4" />
					</CarouselButton>
					<CarouselButton
						className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
						onClick={scrollNext}
						disabled={!nextBtnEnabled}
					>
						<Icon name="ArrowRight" className="h-4 w-4" />
					</CarouselButton>
				</>
			)}
		</div>
	);
};

export const CategoriesCarouselItem = ({
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
