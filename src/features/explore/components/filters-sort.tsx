import { Select } from "@/components/ui/select";

export enum SortBy {
	VERIFIED = "verified",
	CONSTELLATION_VERIFIED = "constellation_verified",
	USER_RATING_LOW_TO_HIGH = "user_rating_low_to_high",
	USER_RATING_HIGH_TO_LOW = "user_rating_high_to_low",
	UNVERIFIED = "unverified",
}

const options = [
	{
		id: SortBy.CONSTELLATION_VERIFIED,
		label: "Const3llation Verified",
		value: SortBy.CONSTELLATION_VERIFIED,
	},
	{
		id: SortBy.USER_RATING_LOW_TO_HIGH,
		label: "User Rating (Low - High)",
		value: SortBy.USER_RATING_LOW_TO_HIGH,
	},
	{
		id: SortBy.USER_RATING_HIGH_TO_LOW,
		label: "User Rating (High - Low)",
		value: SortBy.USER_RATING_HIGH_TO_LOW,
	},
];

type FiltersSortProps = {
	value?: SortBy;
	onChange: (value?: string) => void;
	className?: string;
};

const FiltersSort = ({ onChange, className, value }: FiltersSortProps) => {
	return (
		<div className="w-[200px]">
			<Select
				options={options}
				placeholder="Sort by"
				onChange={(value) => onChange(value?.value)}
				className={className}
				value={value}
			/>
		</div>
	);
};

export default FiltersSort;
