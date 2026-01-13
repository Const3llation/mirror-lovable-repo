import type { ServiceProvider } from "@/types/payload";

export type PublicServiceProvider = Omit<
	ServiceProvider,
	| "id"
	| "email"
	| "phoneNumber"
	| "telegramUsername"
	| "minimumBudget"
	| "createdBy"
> & {
	visibility: Omit<
		ServiceProvider["visibility"],
		"published" | "waitingForModeration"
	>;
};

export const transformToPublicProvider = (
	provider: ServiceProvider,
): PublicServiceProvider => {
	const {
		id,
		email,
		phoneNumber,
		telegramUsername,
		createdBy,
		registrationProcessStatus,
		...rest
	} = provider;

	const { published, waitingForModeration, ...visibilityRest } =
		rest.visibility || {};

	return {
		...rest,
		visibility: visibilityRest,
	} as PublicServiceProvider;
};
