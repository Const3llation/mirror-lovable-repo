import { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type StepValidation<T> = Path<T> | Path<T>[];

interface FormStepConfig<T extends FieldValues> {
	id: string;
	title: string;
	validation?: StepValidation<T>;
	component: React.ComponentType;
}

interface UseMultiStepFormProps<T extends FieldValues> {
	steps: FormStepConfig<T>[];
	form: UseFormReturn<T>;
	initialStep?: FormStepConfig<T>;
	shouldSubmitStep?: boolean;
	onStepSubmit?: (stepId: string, data: unknown) => Promise<boolean>;
	onStepComplete?: (stepId: string) => void;
	onFormComplete?: (formData: T) => void;
}

export function useMultiStepForm<T extends FieldValues>({
	steps,
	form,
	initialStep,
	shouldSubmitStep = false,
	onStepSubmit,
	onStepComplete,
	onFormComplete,
}: UseMultiStepFormProps<T>) {
	const [currentStepId, setCurrentStepId] = useState(
		initialStep?.id ?? steps[0].id,
	);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const currentStepIndex = steps.findIndex((step) => step.id === currentStepId);
	const currentStep = steps[currentStepIndex];
	const isFirstStep = currentStepIndex === 0;
	const isLastStep = currentStepIndex === steps.length - 1;

	const validateCurrentStep = async (): Promise<boolean> => {
		if (!currentStep.validation) {
			return true;
		}

		return form.trigger(currentStep.validation, {
			shouldFocus: true,
		});
	};

	const goToNext = async (): Promise<boolean> => {
		const isStepValid = await validateCurrentStep();
		if (!isStepValid) return false;

		try {
			setIsSubmitting(true);
			const formData = form.getValues(currentStep.validation as unknown);

			let canProceed = true;

			if (shouldSubmitStep && onStepSubmit) {
				canProceed = await onStepSubmit(currentStepId, formData);
			}

			if (canProceed) {
				onStepComplete?.(currentStepId);

				if (isLastStep) {
					onFormComplete?.(form.getValues());
				} else {
					const nextStep = steps[currentStepIndex + 1];
					if (nextStep) {
						setCurrentStepId(nextStep.id);
					}
				}
			}

			return true;
		} catch (error) {
			console.error("Failed to process step:", error);
			return false;
		} finally {
			setIsSubmitting(false);
		}
	};

	const goToPrevious = (): void => {
		if (!isFirstStep) {
			const previousStep = steps[currentStepIndex - 1];
			setCurrentStepId(previousStep.id);
		}
	};

	return {
		currentStep,
		currentStepId,
		isFirstStep,
		isLastStep,
		isSubmitting,
		goToNext,
		goToPrevious,
		getFormData: () => form.getValues(),
	} as const;
}
