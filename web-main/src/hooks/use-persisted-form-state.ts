import { useEffect, useRef } from "react";
import type { FieldValues, UseFormReturn } from "react-hook-form";

const FORM_STORAGE_KEY = "service-provider-form";

export function usePersistedFormState<T extends FieldValues>(
	form: UseFormReturn<T>,
) {
	const formRef = useRef<UseFormReturn<T>>(form);

	useEffect(() => {
		const savedState = sessionStorage.getItem(FORM_STORAGE_KEY);

		if (savedState) {
			try {
				const parsedState = JSON.parse(savedState) as T;
				formRef.current.reset(parsedState?.data);
			} catch (error) {
				if (error instanceof Error) {
					console.error("Error loading saved form state:", error.message);
				}
				sessionStorage.removeItem(FORM_STORAGE_KEY);
			}
		}

		const subscription = formRef.current.watch((data) => {
			sessionStorage.setItem(FORM_STORAGE_KEY, JSON.stringify({ data }));
		});

		return () => subscription.unsubscribe();
	}, []);

	useEffect(() => {
		formRef.current = form;
	}, [form]);

	const clearPersistedState = () => {
		sessionStorage.removeItem(FORM_STORAGE_KEY);
	};

	return {
		clearPersistedState,
	};
}
