import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import useScreenSize from "@/hooks/use-screen-size";

export type ReviewSliderItemProps = {
	fullName: string;
	rating: number;
	review: string;
	category: string;
	createdAt: Date;
};

type Props = ReviewSliderItemProps & {
	onClick: () => void;
};

export default function ReviewSliderItem({
	fullName,
	rating,
	review,
	onClick,
}: Props) {
	const screenSize = useScreenSize();

	const size = {
		sm: "flex-[0_0_90%]",
		md: "flex-[0_0_50%]",
		lg: "flex-[0_0_50%]",
		xl: "flex-[0_0_33.4%]",
	};

	return (
		<div className={`${size[screenSize]} min-w-0 pr-6`}>
			<div
				className="rounded-md py-6 px-4 flex flex-col gap-4 relative min-w-0"
				style={{
					background: `linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
                linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
                radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
				}}
			>
				<div className="absolute bottom-0 -right-3">
					<Icon
						name="Quote"
						className="h-[189px] w-[217px] text-[#0F0B26] self-center"
					/>
				</div>
				<div className="flex flex-col gap-2">
					<div className="w-full flex flex-row justify-between">
						<Body variants="16-medium" className="text-text-300">
							{fullName}
						</Body>
						<div className="flex flex-row gap-0.5 align-middle justify-center">
							<Icon
								name="Star"
								className="h-3.5 w-3.5 text-[#EFF225] self-center"
							/>
							<Body variants="14-regular" className="text-text-100 self-center">
								{rating}
							</Body>
						</div>
					</div>
					<Body
						variants="16-regular"
						className="text-text-100 line-clamp-5 max-h-32"
					>
						{review}
					</Body>
				</div>
				<div onClick={onClick} className="flex flex-row gap-2 cursor-pointer">
					<Body variants="16-regular" className="text-primary-100">
						Read More
					</Body>
					<Icon
						name="ArrowRight"
						className="h-4 w-4 text-primary-100 self-center"
					/>
				</div>
			</div>
		</div>
	);
}
