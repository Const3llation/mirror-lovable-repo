import {
	MultiSelect,
	type MultiSelectOption,
} from "@/components/ui/multi-select";
import { SERVICE_PROVIDER_BUDGET_OPTIONS } from "@/config/consts";

type ProjectBudgetSelectProps = {
	selectedItems?: MultiSelectOption[];
	onChange: (selectedItems: MultiSelectOption[]) => void;
	hideSelectedItemsFromInput?: boolean;
};

const ProjectBudgetSelect = ({
	selectedItems = [],
	onChange,
	hideSelectedItemsFromInput,
}: ProjectBudgetSelectProps) => {
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

	const options = [
		{ id: "all", label: "Any budget", value: "all" },
		...SERVICE_PROVIDER_BUDGET_OPTIONS,
	];

	return (
		<MultiSelect
			size={"md"}
			placeholder="Select budget"
			options={options}
			selectedItems={selectedItems}
			onChange={(val) => {
				handleChange(val);
			}}
			hideSelectedItemsFromInput={hideSelectedItemsFromInput}
		/>
	);
};

export default ProjectBudgetSelect;
