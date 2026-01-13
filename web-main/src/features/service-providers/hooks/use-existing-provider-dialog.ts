import { transformCMStoForm } from "@/features/service-providers/utils/transformers";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import type { ServiceProvider } from "@/types/payload";
import { useCallback, useEffect, useState } from "react";
import type { UseFormReset } from "react-hook-form";
import { useCheckExistingProvider } from "./use-check-existing-provider";

const PROVIDER_CHECK_KEY = "const3llation:provider-check";

interface FormData {
	basicInformation: {
		providerName?: string;
		email?: string;
		foundedYear?: number;
	};
	branding: Record<string, unknown>;
	services: unknown[];
	portfolio: unknown[];
	socialMedia: Record<string, unknown>;
	team: Record<string, unknown>;
}

export const useExistingProviderDialog = (
	email: string | undefined,
	resetForm: UseFormReset<FormData>,
) => {
	const [dialogShown, setDialogShown] = useState(false);
	const [hasChecked, setHasChecked] = useState(() =>
		typeof window !== "undefined"
			? sessionStorage.getItem(PROVIDER_CHECK_KEY) === "true"
			: false,
	);

	const { openDialog } = useDialogContext();

	const { data, isLoading } = useCheckExistingProvider({
		email,
		enabled: !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
	});

	const existingProvider = data?.docs[0];

	const handleExistingData = useCallback(
		(provider: ServiceProvider) => {
			sessionStorage.setItem(PROVIDER_CHECK_KEY, "true");
			setHasChecked(true);

			const formData = transformCMStoForm(provider);
			resetForm(formData);
		},
		[resetForm],
	);

	useEffect(() => {
		if (existingProvider && !hasChecked && !dialogShown) {
			setDialogShown(true);
			openDialog(DialogType.CONTINUE_WITH_EXISTING_DATA, {
				onContinueWithData: () => handleExistingData(existingProvider),
			});
		}
	}, [
		existingProvider,
		hasChecked,
		dialogShown,
		openDialog,
		handleExistingData,
	]);

	const clearPersistedState = () => {
		localStorage.removeItem(PROVIDER_CHECK_KEY);
	};

	return {
		hasChecked,
		clearPersistedState,
		isSearching: isLoading,
	};
};
