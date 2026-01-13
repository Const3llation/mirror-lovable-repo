import { Body } from "@/components/ui/body";

export default function Description({ description }: { description: string }) {
	return (
		<div className="flex flex-col gap-2">
			<Body variants="12-regular" className="text-text-300">
				Description
			</Body>
			<Body variants="16-regular" className="text-text-200">
				{description}
			</Body>
		</div>
	);
}
