"use client";

import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { CarouselButton } from "@/features/home/components/categories-carousel-wrapper";
import DotButton from "@/features/service-providers/components/profile/dot-button";
import PortfolioItem, {
	type PortfolioItemProps,
} from "@/features/service-providers/components/profile/portfolio-item";
import { useDotButton } from "@/features/service-providers/hooks/use-dot-button";
import usePrevNextButtons from "@/features/service-providers/hooks/use-prev-next-buttons";
import useEmblaCarousel from "embla-carousel-react";

export type PortfolioProps = {
	slug: string;
	items: PortfolioItemProps[];
	isPreview?: boolean;
};

export default function Portfolio({ slug, items, isPreview }: PortfolioProps) {
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
		<div
			className="flex flex-col w-full rounded-lg gap-6 lg:gap-10 px-4 py-6 lg:p-10"
			style={{
				background: `
                linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
				linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
				radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
			}}
		>
			<Heading variants="h4" className="text-center text-text-100">
				Portfolio & Success Stories
			</Heading>
			<div className="flex flex-row gap-4 items-middle">
				<CarouselButton
					onClick={scrollPrev}
					disabled={!prevBtnEnabled}
					className="opacity-100 self-center border-8"
				>
					<Icon name="ArrowLeft" className="h-4 w-4 text-text-100" />
				</CarouselButton>
				<div className="relative flex-1 overflow-hidden min-w-0" ref={emblaRef}>
					<div className="w-full flex gap-2 xl:gap-4">
						{items.map((item) => (
							<PortfolioItem
								key={item.title}
								{...item}
								slug={slug}
								disableReadMore={isPreview}
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
			<div className="sm:flex flex-row gap-6 mx-auto hidden">
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
