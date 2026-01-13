"use client";

import CashbackBanner from "@/components/cashback-banner";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { Select, type SelectOption } from "@/components/ui/select";
import ReviewSlider from "@/features/service-providers/components/profile/review-slider";
import type { ReviewSliderItemProps } from "@/features/service-providers/components/profile/review-slider-item";
import isNotEmpty from "@/utils/is-not-empty";
import { useState } from "react";

export type ReviewProps = {
	slug: string;
	items: ReviewSliderItemProps[];
};

enum SortBy {
	USER_RATING_LOW_TO_HIGH = "user_rating_low_to_high",
	USER_RATING_HIGH_TO_LOW = "user_rating_high_to_low",
	DATE_RECENT = "date_recent",
	DATE_OLDEST = "date_oldest",
}

const options = [
	{
		id: SortBy.USER_RATING_LOW_TO_HIGH,
		label: "User Rating (Low - High)",
		value: SortBy.USER_RATING_LOW_TO_HIGH,
	},
	{
		id: SortBy.USER_RATING_HIGH_TO_LOW,
		label: "User Rating (High - Low)",
		value: SortBy.USER_RATING_HIGH_TO_LOW,
	},
	{
		id: SortBy.DATE_RECENT,
		label: "Date: Recent",
		value: SortBy.DATE_RECENT,
	},
	{
		id: SortBy.DATE_OLDEST,
		label: "Date: Oldest",
		value: SortBy.DATE_OLDEST,
	},
];

export default function Reviews({ slug, items }: ReviewProps) {
	const [sortBy, setSortBy] = useState(options[1]);

	const handleSortByChange = (option: SelectOption | null) =>
		setSortBy(options.find((opt) => opt.id === option?.id) ?? options[1]);

	const sortedItems = items.sort((a, b) => {
		switch (sortBy.id) {
			case SortBy.USER_RATING_LOW_TO_HIGH:
				return a.rating - b.rating;
			case SortBy.USER_RATING_HIGH_TO_LOW:
				return b.rating - a.rating;
			case SortBy.DATE_RECENT:
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
			case SortBy.DATE_OLDEST:
				return (
					new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
				);
			default:
				return 0;
		}
	});

	return (
		<div
			className="px-4 py-6 md:p-6 lg:py-10 lg:px-9 rounded-lg flex flex-col gap-16"
			style={{
				background: `linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
				linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
				radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
			}}
		>
			<div className="flex flex-col gap-10">
				<div className="flex flex-col gap-6 md:gap-0 md:grid md:grid-cols-[1fr,auto,1fr]">
					<div>&nbsp;</div>
					<Heading variants="h4" className="mx-auto">
						What Clients Say
					</Heading>
					<div className="w-full flex flex-row justify-end">
						{isNotEmpty(sortedItems) && (
							<Select
								className="w-full sm:w-fit mx-auto md:ml-auto md:mr-0"
								options={options}
								placeholder="Sort by"
								value={sortBy}
								onChange={handleSortByChange}
							/>
						)}
					</div>
				</div>
				{isNotEmpty(sortedItems) ? (
					<ReviewSlider items={sortedItems} />
				) : (
					<Body
						variants="20-medium"
						className="text-text-300 text-center py-10"
					>
						No reviews yet.
					</Body>
				)}
			</div>
			<CashbackBanner redirectTo={`/providers/${slug}/review`} />
		</div>
	);
}
