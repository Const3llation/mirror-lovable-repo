import { Body } from "@/components/ui/body";
import { Icon, type IconName } from "@/components/ui/icon";

type Props = {
	name: string;
	icon: IconName;
	serviceItems: string[];
};

export default function HorizontalServices({
	name,
	icon,
	serviceItems,
}: Props) {
	return (
		<div className="w-full py-6 px-8 flex flex-col gap-5 bg-[#0300147D] rounded-lg border border-stroke-25">
			<div className="flex flex-row gap-5 items-center">
				<div
					className="w-10 h-10 flex flex-col align-center items-center justify-center rounded-lg border border-stroke-5"
					style={{
						background:
							"linear-gradient(180deg, rgba(37, 29, 53, 0.57) 0%, rgba(108, 85, 155, 0.01) 100%)",
					}}
				>
					<Icon name={icon} className="w-5 h-5 text-text-100" />
				</div>
				<Body variants="16-medium" className="text-text-100">
					{name}
				</Body>
			</div>
			<Body variants="16-regular" className="text-text-300">
				{serviceItems.join(", ")}
			</Body>
		</div>
	);
}
