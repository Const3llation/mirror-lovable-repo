"use client";

import { Body } from "@/components/ui/body";
import { Select, type SelectOption } from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

type Props = {
	options: SelectOption[];
};

export default function ChooseCategory({ options }: Props) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const selectedCategory = searchParams.get("category");

	const selectedItem = options.find((option) =>
		selectedCategory?.includes(option.id.toString()),
	);

	const handleChange = (value: SelectOption | null) => {
		const params = new URLSearchParams();
		params.set("category", value?.value ?? "");

		router.replace(`?${params.toString()}`, { scroll: false });
	};

	return (
		<>
			<Body variants="12-regular" className="text-center text-white">
				Choose category
			</Body>
			<Select
				placeholder="All categories"
				value={selectedItem}
				options={options}
				onChange={handleChange}
			/>
		</>
	);
}
