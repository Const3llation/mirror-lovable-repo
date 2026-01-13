import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import { Info } from "@/components/ui/icons";
import { Tooltip } from "@/components/ui/tooltip";

type Props = {
	categories: {
		name: string;
	}[];
};

export default function CategoriesLine({ categories }: Props) {
	if (!categories) return null;

	if (categories.length === 0) return null;

	if (categories.length < 3) {
		return (
			<div className="flex flex-row gap-1">
				<Icon name="Category" className="text-text-300 w-5 h-5" />
				{categories.map(({ name }) => (
					<Body variants="14-regular" key={name} className="text-text-300">
						{name}
					</Body>
				))}
			</div>
		);
	}

	const firstCategory = categories[0];
	const secondCategory = categories[1];

	return (
		<div className="flex flex-row gap-1">
			<Icon name="Category" className="text-text-300 w-5 h-5" />
			<Body
				variants="14-regular"
				key={firstCategory.name}
				className="text-text-300"
			>
				{firstCategory.name},
			</Body>
			<Body
				variants="14-regular"
				key={secondCategory.name}
				className="text-text-300"
			>
				{secondCategory.name}, ...
			</Body>
			<Tooltip content={categories.map(({ name }) => name).join(", ")}>
				<Info className="h-5 w-5 inline-block text-text-300" />
			</Tooltip>
		</div>
	);
}
