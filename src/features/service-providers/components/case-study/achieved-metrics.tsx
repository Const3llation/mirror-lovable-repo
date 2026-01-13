import { Body } from "@/components/ui/body";

type MetricItem = {
	id?: string | null;
	metric?: string | null;
};

type Props = {
	metrics: MetricItem[];
};

export default function AchievedMetrics({ metrics }: Props) {
	return (
		<div className="flex flex-col gap-2">
			<Body variants="12-regular" className="text-text-300">
				Description
			</Body>
			{metrics
				.filter(({ id, metric }) => id && metric)
				.map(({ id, metric }) => (
					<Body key={id} variants="16-regular" className="text-text-200">
						{metric}
					</Body>
				))}
		</div>
	);
}
