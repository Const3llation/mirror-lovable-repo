"use client";

import { Body } from "@/components/ui/body";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/utils/cn";
import { useQuery } from "@tanstack/react-query";
import { useCombobox } from "downshift";
import { ChevronRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type SubCategory = {
	id: string;
	name: string;
	slug: string;
};

type Category = {
	id: string;
	name: string;
	icon: string;
	slug: string;
	subCategories: SubCategory[];
};

type Provider = {
	id: string;
	providerName: string;
	slug: string;
	region: string | null;
	country: string | null;
	companySize: string | null;
	status: string | null;
};

type SearchResponse = {
	categories: Category[];
	providers: Provider[];
	total: {
		providers: number;
		categories: number;
	};
};

type ComboboxItem =
	| ({ type: "provider" } & Provider)
	| ({ type: "category" } & Category)
	| ({ type: "subcategory"; parentCategory: Category } & SubCategory);

type ProviderItem = Extract<ComboboxItem, { type: "provider" }>;
type CategoryItem = Extract<ComboboxItem, { type: "category" }>;
type SubCategoryItem = Extract<ComboboxItem, { type: "subcategory" }>;

async function searchItems(searchTerm: string): Promise<SearchResponse> {
	const params = new URLSearchParams({
		q: searchTerm,
		providersLimit: "5",
		categoriesLimit: "5",
	});

	const response = await fetch(`/api/global-search?${params}`);
	if (!response.ok) {
		throw new Error("Network response was not ok");
	}
	return response.json();
}

const ProviderResultItem = ({
	item,
	...props
}: { item: Provider; [key: string]: unknown }) => (
	<li {...props}>
		<Link href={`/providers/${item.slug}`} className="block">
			<div className="flex flex-col">
				<span className="text-text-100">{item.providerName}</span>
			</div>
		</Link>
	</li>
);

const CategoryResultItem = ({
	item,
	...props
}: { item: Category; [key: string]: unknown }) => (
	<li {...props}>
		<Link href={`/explore/${item.slug}`} className="block">
			<div className="flex items-center justify-between">
				<span>{item.name}</span>
				<ChevronRight className="h-4 w-4 text-text-300" />
			</div>
		</Link>
	</li>
);

const SubCategoryResultItem = ({
	item,
	...props
}: {
	item: { parentCategory: Category } & SubCategory;
	[key: string]: unknown;
}) => (
	<li {...props}>
		<Link href={`/explore?subService=${item.slug}`}>{item.name}</Link>
	</li>
);

export const GlobalSearch = () => {
	const router = useRouter();
	const [inputValue, setInputValue] = useState("");
	const debouncedInputValue = useDebounce(inputValue, 300);

	const { data, isLoading } = useQuery({
		queryKey: ["search", debouncedInputValue],
		queryFn: () => searchItems(debouncedInputValue),
		enabled: debouncedInputValue.length >= 2,
		staleTime: 1000 * 60 * 5,
	});

	const items: ComboboxItem[] = useMemo(() => {
		if (!data) return [];
		const providers = (data.providers || []).map((p) => ({
			...p,
			type: "provider" as const,
		}));
		const categories = (data.categories || []).flatMap((c) => [
			{ ...c, type: "category" as const },
			...c.subCategories.map((sub) => ({
				...sub,
				type: "subcategory" as const,
				parentCategory: c,
			})),
		]);
		return [...providers, ...categories];
	}, [data]);

	const {
		isOpen,
		getInputProps,
		getMenuProps,
		getItemProps,
		highlightedIndex,
	} = useCombobox({
		items,
		inputValue,
		onInputValueChange: ({ inputValue: newValue }) => {
			setInputValue(newValue || "");
		},
		itemToString: (item) => {
			if (!item) return "";
			return "providerName" in item ? item.providerName : item.name;
		},
		onSelectedItemChange: ({ selectedItem }) => {
			if (!selectedItem) {
				return;
			}

			if (selectedItem.type === "provider") {
				router.push(`/providers/${selectedItem.slug}`);
			} else if (selectedItem.type === "category") {
				router.push(`/explore/${selectedItem.slug}`);
			} else if (selectedItem.type === "subcategory") {
				router.push(`/explore?subService=${selectedItem.slug}`);
			}
		},
	});

	const showDropdown = isOpen && debouncedInputValue.length >= 2;
	const showLoading = isLoading && debouncedInputValue.length >= 2;

	const { providerItems, categoryItems, subCategoryItems } = useMemo(() => {
		const providerItems: ProviderItem[] = [];
		const categoryItems: CategoryItem[] = [];
		const subCategoryItems: SubCategoryItem[] = [];

		for (const item of items) {
			if (item.type === "provider") {
				providerItems.push(item);
			} else if (item.type === "category") {
				categoryItems.push(item);
			} else if (item.type === "subcategory") {
				subCategoryItems.push(item);
			}
		}
		return { providerItems, categoryItems, subCategoryItems };
	}, [items]);

	const renderItems = () => {
		let itemIdx = 0;
		const providerHeader = providerItems.length > 0 && (
			<h3 className="px-3 py-2 text-sm font-medium text-text-300">Providers</h3>
		);
		const serviceHeader = (categoryItems.length > 0 ||
			subCategoryItems.length > 0) && (
			<h3 className="px-3 py-2 text-sm font-medium text-text-300">Services</h3>
		);

		return (
			<>
				{providerHeader}
				{providerItems.map((item) => (
					<ProviderResultItem
						key={item.id}
						item={item}
						{...getItemProps({ item, index: itemIdx++ })}
						className={cn(
							"px-3 py-2 text-sm hover:bg-background-100 rounded-md",
							highlightedIndex === itemIdx - 1 && "bg-background-100",
						)}
					/>
				))}

				{serviceHeader}
				{categoryItems.map((category) => {
					const categoryItemIndex = itemIdx++;
					const subs = subCategoryItems.filter(
						(sub) => sub.parentCategory.id === category.id,
					);

					return (
						<li key={category.id}>
							<CategoryResultItem
								item={category}
								{...getItemProps({ item: category, index: categoryItemIndex })}
								className={cn(
									"block px-3 py-2 text-sm text-text-100 hover:bg-background-100 rounded-md",
									highlightedIndex === categoryItemIndex && "bg-background-100",
								)}
							/>
							{subs.length > 0 && (
								<ul className="ml-4 border-l border-stroke-25">
									{subs.map((sub) => {
										const subItemIndex = itemIdx++;
										return (
											<SubCategoryResultItem
												key={sub.id}
												item={sub}
												{...getItemProps({ item: sub, index: subItemIndex })}
												className={cn(
													"block px-3 py-1.5 text-sm text-text-300 hover:text-text-100 hover:bg-background-100 rounded-md",
													highlightedIndex === subItemIndex &&
														"bg-background-100 text-text-100",
												)}
											/>
										);
									})}
								</ul>
							)}
						</li>
					);
				})}

				{!items.length && (
					<li className="px-3 py-2 text-sm text-text-100">
						<Body variants="16-medium">
							No results found. Find all our providers on the &nbsp;
							<Link href="/explore" className="text-primary-100">
								explore page
							</Link>
							.
						</Body>
					</li>
				)}
			</>
		);
	};

	return (
		<div className="relative w-full max-w-2xl z-[100]">
			<div className="relative">
				<input
					{...getInputProps()}
					placeholder="Search"
					className="w-full rounded-full border border-stroke-25 bg-white/5 px-12 py-4 text-base text-text-100 outline-none transition-colors placeholder:text-text-50 focus:border-stroke-100"
				/>
				<div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-300">
					<Search className="h-5 w-5" />
				</div>
			</div>

			<ul
				{...getMenuProps()}
				className={cn(
					"absolute z-[100] mt-5 w-full overflow-hidden rounded-md border border-stroke-25 bg-background-input px-5 py-6 shadow-lg",
					!showDropdown && "hidden",
				)}
			>
				{showDropdown && (
					<div className="flex max-h-80 flex-col gap-4 overflow-y-auto py-1">
						{showLoading ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-5 w-5 animate-spin text-text-100" />
							</div>
						) : (
							<ul className="space-y-1">{renderItems()}</ul>
						)}
					</div>
				)}
			</ul>
		</div>
	);
};
