"use client";

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/base-dialog";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { CarouselButton } from "@/features/home/components/categories-carousel-wrapper";
import DotButton from "@/features/service-providers/components/profile/dot-button";
import type { ReviewSliderItemProps } from "@/features/service-providers/components/profile/review-slider-item";
import ReviewSliderModalItem from "@/features/service-providers/components/profile/review-slider-modal-item";
import { useDotButton } from "@/features/service-providers/hooks/use-dot-button";
import usePrevNextButtons from "@/features/service-providers/hooks/use-prev-next-buttons";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import useEmblaCarousel from "embla-carousel-react";

export default function ReviewsDialog() {
	const { isDialogOpen, closeDialog, getDialogData } = useDialogContext();

	const handleClose = () => {
		closeDialog(DialogType.REVIEW_CAROUSEL);
	};

	const items = getDialogData(
		DialogType.REVIEW_CAROUSEL,
	) as ReviewSliderItemProps[];

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
		<Dialog
			open={isDialogOpen(DialogType.REVIEW_CAROUSEL)}
			onOpenChange={handleClose}
		>
			<DialogContent className="max-w-2xl flex flex-col items-center justify-center">
				<DialogHeader className="mb-6">
					<DialogTitle className="text-lg font-semibold leading-none tracking-tight text-text-100 text-center mb-2">
						<Heading variants="h5" className="text-text-100">
							What Clients Say
						</Heading>
					</DialogTitle>
				</DialogHeader>
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
							{items?.map((item) => (
								<ReviewSliderModalItem key={item.fullName} {...item} />
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
				<div className="md:flex flex-row gap-6 mx-auto hidden mt-8">
					{scrollSnaps.map((_, index) => (
						<DotButton
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							onClick={() => onDotButtonClick(index)}
							isSelected={index === selectedIndex}
						/>
					))}
				</div>
			</DialogContent>
		</Dialog>
	);
}
