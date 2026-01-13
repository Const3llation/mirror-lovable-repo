"use client";

import { Body } from "@/components/ui/body";
import useDebounce from "@/hooks/use-debounce";
import { cn } from "@/utils/cn";
import { useQuery } from "@tanstack/react-query";
import { useCombobox } from "downshift";
import { Loader2, Search } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type SearchResponse = {
	categories: Array<{
		id: number;
		title: string;
		priority: number;
	}>;
	providers: Array<{
		id: number;
		providerName: string;
		slug: string;
		region: string | null;
		country: string | null;
		companySize: string | null;
		categories: string;
		subCategories: string;
	}>;
};

async function searchItems(searchTerm: string): Promise<SearchResponse> {
	const params = new URLSearchParams({
		q: searchTerm,
		providersLimit: "5",
		categoriesLimit: "5",
	});

	const response = await fetch(`/api/global-search?${params}`);
	if (!response.ok) throw new Error("Network response was not ok");
	return response.json();
}

const MainNavSearch = () => {
	const [isExpanded, setIsExpanded] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const containerRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const debouncedInputValue = useDebounce(inputValue, 300);

	const { data, isLoading } = useQuery({
		queryKey: ["search", debouncedInputValue],
		queryFn: () => searchItems(debouncedInputValue),
		enabled: debouncedInputValue.length >= 2,
		staleTime: 1000 * 60 * 5,
	});

	const items = [...(data?.providers || []), ...(data?.categories || [])];

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
		itemToString: (item) => item?.title || "",
	});

	// Handle clicks outside to collapse
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node) &&
				isExpanded
			) {
				setIsExpanded(false);
				setInputValue("");
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, [isExpanded]);

	// Focus input when expanded
	useEffect(() => {
		if (isExpanded && inputRef.current) {
			inputRef.current.focus();
		}
	}, [isExpanded]);

	const showDropdown = isOpen && debouncedInputValue.length >= 2;
	const showLoading = isLoading && debouncedInputValue.length >= 2;

	return (
		<div ref={containerRef} className="relative w-64 h-12">
			<div
				className={cn(
					"flex items-center rounded-full border border-stroke-25 transition-all duration-300 ease-in-out absolute right-0 top-0",
					isExpanded
						? "w-64 h-12 bg-background-input"
						: "w-12 h-12 cursor-pointer bg-transparent",
				)}
				onClick={() => !isExpanded && setIsExpanded(true)}
			>
				<div className="flex items-center p-3">
					<Search width={20} height={20} className="text-text-300" />
				</div>
				<input
					{...getInputProps({ ref: inputRef })}
					className={cn(
						"bg-transparent text-text-100 outline-none placeholder:text-text-50",
						!isExpanded && "w-0 p-0",
						isExpanded && "w-full pr-4",
					)}
					placeholder="Search"
				/>
			</div>

			{/* Dropdown Menu */}
			<ul
				{...getMenuProps()}
				className={cn(
					"absolute right-0 z-50 top-full mt-2 w-64 overflow-auto rounded-md border border-stroke-25 bg-background-input px-3 py-3 shadow-lg",
					!showDropdown && "hidden",
				)}
			>
				{showDropdown && (
					<div className="flex flex-col gap-4 py-1">
						{showLoading ? (
							<div className="flex items-center justify-center py-4">
								<Loader2 className="h-5 w-5 animate-spin text-text-100" />
							</div>
						) : (
							<>
								{/* Categories Section */}
								{data?.categories.length ? (
									<div>
										<h3 className="px-3 py-2 text-sm font-medium text-text-300">
											Services
										</h3>
										<ul>
											{data?.categories.map((item, index) => (
												<Link key={item.id} href={`/explore/${item.slug}`}>
													<li
														{...getItemProps({
															item,
															index: index + (data?.providers?.length || 0),
															className: cn(
																"px-3 py-2 text-sm cursor-pointer select-none text-text-100",
																highlightedIndex ===
																	index + (data?.providers?.length || 0)
																	? "bg-background-100"
																	: "bg-transparent",
															),
														})}
													>
														<span className="text-text-100">{item.name}</span>
													</li>
												</Link>
											))}
										</ul>
									</div>
								) : null}

								{/* Service Providers Section */}
								{data?.providers.length ? (
									<div>
										<h3 className="px-3 py-2 text-sm font-medium text-text-300">
											Providers
										</h3>
										<ul>
											{data.providers.map((item, index) => (
												<Link key={item.id} href={`/providers/${item.slug}`}>
													<li
														{...getItemProps({
															item,
															index,
															className: cn(
																"px-3 py-2 text-sm cursor-pointer select-none",
																highlightedIndex === index
																	? "bg-background-100"
																	: "bg-transparent",
															),
														})}
													>
														<span className="text-text-100">
															{item.providerName}
														</span>
													</li>
												</Link>
											))}
										</ul>
									</div>
								) : null}

								{!data?.providers.length && !data?.categories.length && (
									<li className="px-3 py-2 text-sm text-text-100">
										<Body variants="14-medium">
											No results found. Find all our providers on the{" "}
											<Link href="/explore" className="text-primary-100">
												explore page
											</Link>
											.
										</Body>
									</li>
								)}
							</>
						)}
					</div>
				)}
			</ul>
		</div>
	);
};

export default MainNavSearch;
