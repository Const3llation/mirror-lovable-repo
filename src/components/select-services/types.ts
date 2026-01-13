export type EnhancedMultiSelectOption = import(
	"@/components/ui/multi-select",
).MultiSelectOption & {
	type: "category" | "sub-category";
	subService?: Array<{
		id: string | number;
		label: string;
		value: string | number;
	}>;
};

export interface ServiceOption extends EnhancedMultiSelectOption {
	subService?: Array<EnhancedMultiSelectOption>;
}
