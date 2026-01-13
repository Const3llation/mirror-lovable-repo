import type { EmblaCarouselType } from "@/features/service-providers/hooks/use-dot-button";
import { useCallback, useEffect, useState } from "react";

type Props = {
	emblaApi: EmblaCarouselType;
};

export default function usePrevNextButtons({ emblaApi }: Props) {
	const [prevBtnEnabled, setPrevBtnEnabled] = useState(true);
	const [nextBtnEnabled, setNextBtnEnabled] = useState(true);

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

	return {
		scrollPrev,
		scrollNext,
		prevBtnEnabled,
		nextBtnEnabled,
	};
}
