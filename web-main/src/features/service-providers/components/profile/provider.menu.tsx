import { Body } from "@/components/ui/body";

type MenuItem = {
	label: string;
	id: string;
};

type Props = {
	items: MenuItem[];
};

export default function ProviderMenu({ items }: Props) {
	return (
		<div className="w-52 py-10 px-4 flex flex-col gap-8 bg-background-base rounded-xl border border-stroke-25">
			<Body variants="12-regular" className="text-text-300 uppercase">
				Menu
			</Body>
			<ul className="flex flex-col gap-4">
				{items.map((item) => (
					<li key={item.id}>
						<a href={`#${item.id}`} className="text-lg text-gray-600">
							{item.label}
						</a>
					</li>
				))}
			</ul>
		</div>
	);
}

type MenuItemProps = MenuItem & { isSelected: boolean };

function Item({ id, label, isSelected }: MenuItemProps) {
	return <li>{label}</li>;
}
