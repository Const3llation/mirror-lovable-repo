import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import { cn } from "@/utils/cn";
import React from "react";

interface StarsRatingProps {
	value: number;
	onChange: (rating: number) => void;
	className?: string;
}

export function StarsRating({ value, onChange, className }: StarsRatingProps) {
	const [hoveredRating, setHoveredRating] = React.useState<number | null>(null);

	return (
		<div className={cn("flex gap-8", className)}>
			{[1, 2, 3, 4, 5].map((rating) => (
				<div
					key={rating}
					className="flex cursor-pointer flex-col items-center gap-2"
					onClick={() => onChange(rating)}
					onMouseEnter={() => setHoveredRating(rating)}
					onMouseLeave={() => setHoveredRating(null)}
				>
					<Icon
						name="Star"
						width={32}
						height={32}
						className={cn(
							"transition-colors",
							(
								hoveredRating !== null
									? rating <= hoveredRating
									: rating <= value
							)
								? "fill-status-yellow-200 text-status-yellow-200"
								: "fill-white/20 text-white/20",
						)}
					/>
					<Body variants="14-medium" className="text-gray-500">
						{rating}
					</Body>
				</div>
			))}
		</div>
	);
}
