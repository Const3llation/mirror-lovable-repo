export const SLUGS = {
	serviceProviders: "service-providers",
	categories: "categories",
	subCategories: "sub-categories",
} as const;

export const SERVICE_PROVIDER_BUDGET_OPTIONS = [
	{
		id: "less_than_1k",
		label: "< $1000",
		value: "less_than_1k",
	},
	{
		id: "1k_to_5k",
		label: "$1000 - $5000",
		value: "1k_to_5k",
	},
	{
		id: "5k_to_10k",
		label: "$5000 - $10000",
		value: "5k_to_10k",
	},
	{
		id: "10k_to_50k",
		label: "$10000 - $50000",
		value: "10k_to_50k",
	},
	{
		id: "50k_plus",
		label: "$50000+",
		value: "50k_plus",
	},
];

export const SERVICE_PROVIDER_TIMELINE_OPTIONS = [
	{
		id: "less_than_1_month",
		label: "< 1 Month",
		value: "less_than_1_month",
	},
	{
		id: "1_to_3_months",
		label: "1 - 3 Months",
		value: "1_to_3_months",
	},
	{
		id: "3_to_6_months",
		label: "3 - 6 Months",
		value: "3_to_6_months",
	},
	{
		id: "6_to_12_months",
		label: "6 - 12 Months",
		value: "6_to_12_months",
	},
	{
		id: "1_year_plus",
		label: "1 Year+",
		value: "1_year_plus",
	},
];

export const CRYPTO_OPTIONS = [
	{ id: "BSC", label: "BSC (Binance Smart Chain)", value: "BSC" },
	{ id: "ERC-20", label: "ERC-20 (Ethereum Standard)", value: "ERC-20" },
];
