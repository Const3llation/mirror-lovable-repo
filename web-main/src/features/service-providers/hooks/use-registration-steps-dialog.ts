import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const REGISTRATION_STEPS_KEY = "const3llation:registration-steps-shown";

/**
 * This dialog is triggered in these cases even if user acknowledged dialog before:
 * 1. first visit to the page
 * 2. user opens/closes tab
 * 3. users navigates away and comes back
 *
 * But it's not shown if users reloads the window after acknowledging the dialog.
 */
const useRegistrationStepsDialog = () => {
	const { openDialog } = useDialogContext();
	const router = useRouter();
	const pathname = usePathname();

	useEffect(() => {
		const handleBeforeUnload = () => {
			sessionStorage.removeItem(REGISTRATION_STEPS_KEY);
		};

		const hasBeenShown =
			sessionStorage.getItem(REGISTRATION_STEPS_KEY) === "true";
		const isFirstLoad =
			!performance.navigation?.type ||
			performance.navigation.type === performance.navigation.TYPE_NAVIGATE;

		if (!hasBeenShown && isFirstLoad) {
			openDialog(DialogType.CREATE_PROVIDER_STEPS, {
				onContinue: () => {
					try {
						sessionStorage.setItem(REGISTRATION_STEPS_KEY, "true");
					} catch (error) {
						console.error(
							"Failed to persist registration dialog state:",
							error,
						);
					}
				},
				onCancel: () => {
					router.push("/");
				},
			});
		}

		window.addEventListener("beforeunload", handleBeforeUnload);

		return () => {
			if (pathname !== "/") {
				sessionStorage.removeItem(REGISTRATION_STEPS_KEY);
			}
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [openDialog, router, pathname]);
};
export default useRegistrationStepsDialog;
