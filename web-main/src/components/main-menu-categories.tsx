// @ts-nocheck

import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import NextLink from "next/link";

import type { MainNavigation } from "@/types/payload";

type MainMenuCategoriesProps = {
	categories: MainNavigation["megaMenuCategories"];
};

const MainMenuCategories = ({ categories }: MainMenuCategoriesProps) => {
	if (!Array.isArray(categories) || categories.length === 0) return null;

	const itemsPerColumn = Math.ceil(categories.length / 3);
	const columns = Array.from({ length: 3 }, (_, columnIndex) =>
		categories.slice(
			columnIndex * itemsPerColumn,
			(columnIndex + 1) * itemsPerColumn,
		),
	);

	return (
		<div className="grid grid-cols-3 p-4">
			{columns.map((column, columnIndex) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: we don't need to optimize this here
				<div key={`column-${columnIndex}`} className="flex flex-col">
					{column.map((item) => {
						if (!item?.category) return null;
						const { category } = item;

						return (
							<NextLink
								key={category.id}
								href={`/explore/${category.slug}`}
								className="flex items-center gap-3 px-4 py-2 transition-colors text-text-100 hover:text-primary-100"
							>
								<Icon
									name={category.icon}
									className="w-5 h-5 text-primary-100 flex-shrink-0"
								/>
								<Body variants="16-medium">{category.name}</Body>
							</NextLink>
						);
					})}
				</div>
			))}
		</div>
	);
};

export default MainMenuCategories;
