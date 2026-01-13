"use client";

import { type DialogContextType, useDialogs } from "@/hooks/use-dialog";
import { type ReactNode, createContext, useContext } from "react";

const DialogContext = createContext<DialogContextType | undefined>(undefined);

export function DialogProvider({ children }: { children: ReactNode }) {
	const dialogs = useDialogs();

	return (
		<DialogContext.Provider value={dialogs}>{children}</DialogContext.Provider>
	);
}

export const useDialogContext = () => {
	const context = useContext(DialogContext);
	if (!context) {
		throw new Error("useDialogContext must be used within DialogProvider");
	}
	return context;
};
