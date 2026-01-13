"use client";
import type { MultiSelectOption } from "@/components/ui/multi-select";
import { cn } from "@/utils/cn";
import { Star } from "lucide-react";
import React from "react";

const CLIENT_RATING_OPTIONS = ["1", "2", "3", "4", "5"].map((rating) => ({
	id: rating,
	label: `${rating} star${rating !== "1" ? "s" : ""}`,
	value: rating,
}));

const SelectRatingMobile = ({
	value = [],
	onChange,
}: {
	value?: MultiSelectOption[];
	onChange?: (value: MultiSelectOption[]) => void;
}) => {
	const [hoveredRating, setHoveredRating] = React.useState<string | null>(null);

	// Get the currently selected rating value (if any)
	const currentRatingValue = value.length > 0 ? value[0].value : "";

	const handleStarClick = (option: MultiSelectOption) => {
		if (!onChange) return;

		// If user clicks the currently selected rating, deselect it
		if (value.some((item) => item.id === option.id)) {
			onChange([]);
		} else {
			// Otherwise, select only this rating
			onChange([option]);
		}
	};

	return (
		<div className="flex gap-2 py-4">
			{CLIENT_RATING_OPTIONS.map((option) => (
				<button
					key={option.id}
					type="button"
					onClick={() => handleStarClick(option)}
					onMouseEnter={() => setHoveredRating(option.value)}
					onMouseLeave={() => setHoveredRating(null)}
					className="p-1.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
					aria-label={`Rate ${option.label}`}
				>
					<Star
						size={24}
						className={cn(
							"transition-colors",
							(
								hoveredRating !== null
									? Number.parseInt(option.value) <=
										Number.parseInt(hoveredRating)
									: value.some((item) => item.id === option.id) ||
										(currentRatingValue &&
											Number.parseInt(option.value) <=
												Number.parseInt(currentRatingValue))
							)
								? "fill-status-yellow-200 text-status-yellow-200"
								: "text-gray-300",
						)}
					/>
				</button>
			))}
		</div>
	);
};

export default SelectRatingMobile;
