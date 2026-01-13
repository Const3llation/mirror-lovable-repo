"use client";

import { Icon } from "@/components/ui/icon";
import { CarouselButton } from "@/features/home/components/categories-carousel-wrapper";
import DotButton from "@/features/service-providers/components/profile/dot-button";
import { useDotButton } from "@/features/service-providers/hooks/use-dot-button";
import usePrevNextButtons from "@/features/service-providers/hooks/use-prev-next-buttons";
import useEmblaCarousel from "embla-carousel-react";
import Image from "next/image";

export default function Slider() {
	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: false,
		slidesToScroll: 1,
	});

	const { scrollPrev, scrollNext, prevBtnEnabled, nextBtnEnabled } =
		usePrevNextButtons({ emblaApi });

	const { scrollSnaps, onDotButtonClick, selectedIndex } =
		useDotButton(emblaApi);

	return (
		<div className="flex flex-col gap-6">
			<div className="flex flex-row gap-4 items-middle w-full">
				<CarouselButton
					onClick={scrollPrev}
					disabled={!prevBtnEnabled}
					className="opacity-100 self-center border-8"
				>
					<Icon name="ArrowLeft" className="h-4 w-4 text-text-100" />
				</CarouselButton>
				<div
					className="w-full relative flex-1 flex flex-row overflow-hidden"
					ref={emblaRef}
				>
					<div className="w-full flex-1 flex">
						{Array.from({ length: 5 }).map((_, index) => (
							<Image
								src="https://via.assets.so/img.jpg?w=700&h=400"
								className="w-full"
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								alt="Project image"
								width={700}
								height={400}
							/>
						))}
					</div>
				</div>
				<CarouselButton
					onClick={scrollNext}
					disabled={!nextBtnEnabled}
					className="opacity-100 self-center border-8"
				>
					<Icon
						name="ArrowRight"
						className="h-4 w-4 text-text-100 self-center"
					/>
				</CarouselButton>
			</div>
			<div className="md:flex flex-row gap-6 mx-auto hidden">
				{scrollSnaps.map((_, index) => (
					<DotButton
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={index}
						onClick={() => onDotButtonClick(index)}
						isSelected={index === selectedIndex}
					/>
				))}
			</div>
		</div>
	);
}
