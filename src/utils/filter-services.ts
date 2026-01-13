import type { MultiSelectOption } from "@/components/ui/multi-select";

export type ServiceOption = MultiSelectOption & {
	type?: "category" | "sub-category";
	subService?: Array<{
		id: string | number;
		label: string;
		value: string | number;
		type?: "category" | "sub-category";
	}>;
};

/**
 * Filters services and their subservices based on a search query
 *
 * @param services - Array of service options with potential subservices
 * @param searchQuery - Search query to filter by
 * @returns Filtered array of service options
 */
export const filterServices = (
	services: ServiceOption[],
	searchQuery: string,
): ServiceOption[] => {
	if (!searchQuery) return services;

	const lowerQuery = searchQuery.toLowerCase();

	return services.reduce<ServiceOption[]>((acc, service) => {
		const parentMatches = service.label.toLowerCase().includes(lowerQuery);

		const matchingSubServices = service.subService?.filter((sub) =>
			sub.label.toLowerCase().includes(lowerQuery),
		);

		if (parentMatches || matchingSubServices?.length) {
			acc.push({
				...service,
				subService: parentMatches ? service.subService : matchingSubServices,
			});
		}
		return acc;
	}, []);
};
