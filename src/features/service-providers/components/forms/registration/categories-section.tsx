import { Body } from "@/components/ui/body";
import { Icon, type IconName } from "@/components/ui/icon";
import IconBadge from "@/components/ui/icon-badge";
import { Tooltip } from "@/components/ui/tooltip";
import type { SubCategory } from "@/types/payload";
import { Info } from "lucide-react";
import { useMemo } from "react";

interface Category {
	id: number;
	name: string;
	icon?: IconName;
}

interface CategoriesSectionProps {
	categories: Category[];
	subCategories?: SubCategory[];
	maxVisible?: number;
	includeChildrenCategories?: boolean;
}

interface CategoryItemProps {
	name: string;
	icon?: IconName;
	subCategories?: SubCategory[];
	maxLength?: number; // Optional prop to control truncation length
}

const getCategoryIcon = (iconName: IconName) => {
	const options = {
		width: 14,
		height: 14,
	};

	return <Icon name={iconName} {...options} />;
};

export const CategoryItem = ({
	name,
	icon,
	subCategories,
	maxLength = 50,
}: CategoryItemProps) => {
	const iconCmp = icon ? getCategoryIcon(icon) : null;

	// Memoize the formatted name to prevent unnecessary recalculations
	const { displayName, fullName } = useMemo(() => {
		if (!subCategories) {
			return { displayName: name, fullName: name };
		}

		const subCategoryNames = subCategories.map(
			(subCategory) => subCategory.name,
		);
		const complete = `${name}: ${subCategoryNames.join(", ")}`;

		// If the complete name is longer than maxLength, truncate it
		const shouldTruncate = complete.length > maxLength;
		const truncated = shouldTruncate
			? `${complete.slice(0, maxLength)}...`
			: complete;

		return {
			displayName: truncated,
			fullName: complete,
		};
	}, [name, subCategories, maxLength]);

	// If the text is truncated, wrap it in a tooltip
	const content =
		displayName !== fullName ? (
			<Tooltip content={fullName} className="max-w-[300px]">
				<span className="cursor-help">{displayName}</span>
			</Tooltip>
		) : (
			displayName
		);

	return (
		<div className="flex items-center gap-2">
			{iconCmp && (
				<IconBadge size="sm" className="text-text-100">
					{iconCmp}
				</IconBadge>
			)}
			<Body variants="14-medium" className="text-text-200">
				{content}
			</Body>
		</div>
	);
};
export const CategoriesSection = ({
	categories,
	subCategories,
	maxVisible = 3,
	includeChildrenCategories,
}: CategoriesSectionProps) => {
	const visibleCategories = categories.slice(0, maxVisible);
	const remainingCategories = categories.slice(maxVisible);
	const hasMoreCategories = remainingCategories.length > 0;

	const tooltipContent = remainingCategories
		.map((category) => category.name)
		.join(", ");

	return (
		<div className="flex flex-col">
			<Body variants="12-regular" className="mb-4 text-text-300 text-left">
				Services
			</Body>
			<div className="flex flex-col gap-2 mb-2">
				{visibleCategories.map((category) => {
					const props = {
						name: category.name,
						icon: category.icon as IconName,
						subCategories: includeChildrenCategories
							? subCategories?.filter(
									// biome-ignore lint/suspicious/noExplicitAny: <explanation>
									(subCategory: any) => {
										if (typeof subCategory.parentCategory === "object") {
											return subCategory.parentCategory.id === category.id;
										}
										return subCategory.parentCategory === category.id;
									},
								)
							: undefined,
					};

					return <CategoryItem key={category.id} {...props} />;
				})}
			</div>
			{hasMoreCategories && (
				<Tooltip content={tooltipContent}>
					{/* Tooltip is not opening when we use Body component, so we use p instead. */}
					<p className="text-primary-150 text-left w-fit inline-block cursor-pointer text-xs font-medium">
						+ {remainingCategories.length} more service
						{remainingCategories.length === 1 ? "" : "s"} &nbsp;
						<Info className="h-4 w-4 inline-block" />
					</p>
				</Tooltip>
			)}
		</div>
	);
};
