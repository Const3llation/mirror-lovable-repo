"use client";

import { Icon } from "@/components/ui/icon";
import { CarouselButton } from "@/features/home/components/categories-carousel-wrapper";
import DotButton from "@/features/service-providers/components/profile/dot-button";
import ReviewSliderItem, {
	type ReviewSliderItemProps,
} from "@/features/service-providers/components/profile/review-slider-item";
import { useDotButton } from "@/features/service-providers/hooks/use-dot-button";
import usePrevNextButtons from "@/features/service-providers/hooks/use-prev-next-buttons";
import useScreenSize from "@/hooks/use-screen-size";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import useEmblaCarousel from "embla-carousel-react";

export type ReviewSliderProps = {
	items: ReviewSliderItemProps[];
};

export default function ReviewSlider({ items }: ReviewSliderProps) {
	const screenSize = useScreenSize();
	const { openDialog } = useDialogContext();

	const numberOfItemsInBatch = {
		sm: 1,
		md: 2,
		lg: 2,
		xl: 3,
	};

	const [emblaRef, emblaApi] = useEmblaCarousel({
		align: "start",
		dragFree: false,
		slidesToScroll: numberOfItemsInBatch[screenSize],
	});

	const { scrollPrev, scrollNext, prevBtnEnabled, nextBtnEnabled } =
		usePrevNextButtons({ emblaApi });

	const { scrollSnaps, onDotButtonClick, selectedIndex } =
		useDotButton(emblaApi);

	const handleClick = () => {
		openDialog(DialogType.REVIEW_CAROUSEL, items);
	};

	return (
		<>
			<div className="flex flex-row gap-4 items-middle">
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
					<div className="w-full flex">
						{items.map((item) => (
							<ReviewSliderItem
								key={item.fullName}
								{...item}
								onClick={handleClick}
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
		</>
	);
}
