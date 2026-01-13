import {
	MultiSelect,
	type MultiSelectOption,
} from "@/components/ui/multi-select";
import { getSupportedCountriesOptions } from "@/utils/country";

const LOCATION_OPTIONS = getSupportedCountriesOptions().map((country) => ({
	id: country.value,
	...country,
}));

type LocationSelectProps = {
	selectedItems?: MultiSelectOption[];
	onChange: (selectedItems: MultiSelectOption[]) => void;
	hideSelectedItemsFromInput: boolean;
};

const LocationSelect = ({
	selectedItems = [],
	onChange,
	hideSelectedItemsFromInput,
}: LocationSelectProps) => {
	const handleChange = (newSelectedItems: MultiSelectOption[]) => {
		// Create a map to count occurrences of each item by id
		const occurrences = new Map<string, number>();

		// Count occurrences of each item
		for (const item of newSelectedItems) {
			const count = occurrences.get(item.id) || 0;
			occurrences.set(item.id, count + 1);
		}

		// Filter out items that appear more than once
		const filteredItems = newSelectedItems.filter(
			(item) => occurrences.get(item.id) === 1,
		);

		onChange(filteredItems);
	};

	return (
		<MultiSelect
			size={"md"}
			placeholder="Company location"
			options={LOCATION_OPTIONS}
			withSearch
			widthStrategy="fit-content"
			selectedItems={selectedItems}
			onChange={handleChange}
			hideSelectedItemsFromInput={hideSelectedItemsFromInput}
		/>
	);
};

export default LocationSelect;
