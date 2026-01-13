"use client";

import { Body } from "@/components/ui/body";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/utils/cn";
import { useQuery } from "@tanstack/react-query";
import { useCombobox } from "downshift";
import { Loader2, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

type Category = {
	id: string;
	name: string;
	slug: string;
	priority: number;
};

type Provider = {
	id: string;
	providerName: string;
	slug: string;
	region: string | null;
	country: string | null;
	companySize: string | null;
	categories: string;
	subCategories: string;
};

type SearchResponse = {
	categories: Category[];
	providers: Provider[];
};

type ComboboxItem =
	| ({ type: "provider" } & Provider)
	| ({ type: "category" } & Category);

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

const Search = () => {
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
		const categories = (data.categories || []).map((c) => ({
			...c,
			type: "category" as const,
		}));
		return [...providers, ...categories];
	}, [data]);

	const {
		isOpen,
		getInputProps,
		getItemProps,
		getMenuProps,
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
			}
		},
	});

	const showDropdown = isOpen && debouncedInputValue.length >= 2;
	const showLoading = isLoading && debouncedInputValue.length >= 2;

	return (
		<div className="relative w-full">
			<div className="relative">
				<input
					{...getInputProps()}
					placeholder="Search"
					className={cn(
						"w-full rounded-lg border border-stroke-25 bg-background-base pl-12 pr-4 py-2 text-base text-text-100 outline-none transition-colors placeholder:text-text-50 focus:border-primary-100",
					)}
				/>
				<div className="absolute left-4 top-1/2 -translate-y-1/2 text-text-300">
					<SearchIcon className="h-5 w-5" />
				</div>
			</div>

			<ul
				{...getMenuProps()}
				className={cn(
					"absolute z-50 mt-5 w-full overflow-auto rounded-md border border-stroke-25 bg-background-input px-5 py-6 shadow-lg",
					!showDropdown && "hidden",
				)}
			>
				{showDropdown && (
					<div className="flex flex-col py-1 text-left">
						{showLoading ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-5 w-5 animate-spin text-text-100" />
							</div>
						) : (
							<div>
								{/* Categories Section */}
								{data?.categories.length ? (
									<>
										<h3 className="px-3 py-2 text-sm font-medium text-text-300">
											Services
										</h3>
										<ul className="mb-4">
											{data.categories.map((item, index) => (
												<li
													key={item.id}
													{...getItemProps({
														item: items.find(
															(i) => i.type === "category" && i.id === item.id,
														)!,
														index: index + (data?.providers?.length || 0),
														className: cn(
															"px-3 py-2 text-sm cursor-default select-none text-text-100",
															highlightedIndex ===
																index + (data?.providers?.length || 0)
																? "bg-background-100"
																: "bg-transparent",
														),
													})}
												>
													<span className="text-text-100">{item.name}</span>
												</li>
											))}
										</ul>
									</>
								) : null}

								{/* Service Providers Section */}
								{data?.providers.length ? (
									<div>
										<h3 className="px-3 py-2 text-sm font-medium text-text-300">
											Providers
										</h3>
										<ul>
											{data.providers.map((item, index) => (
												<li
													key={item.id}
													{...getItemProps({
														item: items.find(
															(i) => i.type === "provider" && i.id === item.id,
														)!,
														index,
														className: cn(
															"px-3 py-2 text-sm cursor-default select-none",
															highlightedIndex === index
																? "bg-background-100"
																: "bg-transparent",
														),
													})}
												>
													<div className="flex flex-col">
														<span className="text-text-100">
															{item.providerName}
														</span>
													</div>
												</li>
											))}
										</ul>
									</div>
								) : null}

								{!data?.providers.length && !data?.categories.length && (
									<li className="px-3 py-2 text-sm text-text-100">
										<Body variants="14-medium">
											No results found. Find all our providers on the &nbsp;
											<Link href="/explore" className="text-primary-100">
												explore page
											</Link>
											.
										</Body>
									</li>
								)}
							</div>
						)}
					</div>
				)}
			</ul>
		</div>
	);
};

export default Search;
