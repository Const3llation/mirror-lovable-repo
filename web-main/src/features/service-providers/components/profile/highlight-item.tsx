import { Body } from "@/components/ui/body";
import { Icon, type IconName } from "@/components/ui/icon";

type Props = {
	icon: IconName;
	title: string;
	value: string;
};

export default function HighlightItem({ icon, title, value }: Props) {
	return (
		<div className="rounded-lg p-4 border border-stroke-5 flex flex-row gap-5">
			<div className="w-10 h-10 bg-gradient-4 rounded-lg flex items-center justify-center border border-stroke-5">
				<div className="w-6 h-6">
					<Icon name={icon} width={24} height={24} className="text-text-100" />
				</div>
			</div>
			<div className="flex flex-col gap-2">
				<Body variants="12-regular" className="text-text-300">
					{title}
				</Body>
				<Body variants="14-medium" className="text-text-100">
					{value}
				</Body>
			</div>
		</div>
	);
}
