import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";

export type ReviewSliderItemProps = {
	fullName: string;
	rating: number;
	review: string;
	category: string;
};

export default function ReviewSliderModalItem({
	fullName,
	rating,
	review,
	category,
}: ReviewSliderItemProps) {
	return (
		<div
			className="min-w-full border border-stroke-25 rounded-md py-6 px-4 flex flex-col gap-4 relative"
			style={{
				background: `linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
					linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
					radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
			}}
		>
			<div className="flex flex-col gap-4">
				<div className="w-full flex flex-col gap-1 justify-start">
					<Body variants="16-medium" className="text-text-300">
						{fullName}
					</Body>
					<div className="flex flex-row gap-0.5 align-middle justify-center self-start">
						<Icon
							name="Star"
							className="h-3.5 w-3.5 text-[#EFF225] self-center"
						/>
						<Body variants="14-regular" className="text-text-100 self-center">
							{rating}
						</Body>
					</div>
				</div>
				<Body variants="16-regular" className="text-text-100">
					{review}
				</Body>
				<div className="flex flex-row gap-1">
					<Icon
						name="Category"
						className="h-4 w-4 text-primary-100 self-center"
					/>
					<Body variants="14-regular" className="text-text-300 self-center">
						{category}
					</Body>
				</div>
			</div>
		</div>
	);
}
