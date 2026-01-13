import type { DialogState, DialogType } from "@/types/dialogs";
import { useCallback, useState } from "react";

export function useDialogs(initialState: DialogState = {}) {
	const [dialogState, setDialogState] = useState<DialogState>(initialState);

	const openDialog = useCallback((dialogType: DialogType, data?: unknown) => {
		setDialogState((prev) => ({
			...prev,
			[dialogType]: { isOpen: true, data },
		}));
	}, []);

	const closeDialog = useCallback((dialogType: DialogType) => {
		setDialogState((prev) => ({
			...prev,
			[dialogType]: { isOpen: false },
		}));
	}, []);

	const isDialogOpen = useCallback(
		(dialogType: DialogType) => dialogState[dialogType]?.isOpen ?? false,
		[dialogState],
	);

	const getDialogData = useCallback(
		(dialogType: DialogType) => dialogState[dialogType]?.data,
		[dialogState],
	);

	return {
		openDialog,
		closeDialog,
		isDialogOpen,
		getDialogData,
	};
}

export type DialogContextType = ReturnType<typeof useDialogs>;
