"use client";

import { Button } from "@/components/ui/button";

interface ButtonLabels {
	previous: string;
	next: string;
	submit: string;
	submitting: string;
}

interface StepNavigationProps {
	isFirstStep: boolean;
	isLastStep: boolean;
	isSubmitting: boolean;
	onNext: () => Promise<void>;
	onPrevious: () => void;
	labels?: Partial<ButtonLabels>;
}

const defaultLabels: ButtonLabels = {
	previous: "Previous",
	next: "Save and continue",
	submit: "Submit",
	submitting: "Saving...",
} as const;

export function StepNavigation({
	isFirstStep,
	isLastStep,
	isSubmitting,
	onNext,
	onPrevious,
	labels = {},
}: StepNavigationProps) {
	const buttonLabels = { ...defaultLabels, ...labels };

	return (
		<div className="flex flex-col sm:flex-row justify-between gap-4 sm:gap-8">
			<Button
				variant="secondary"
				size={"md"}
				onClick={onPrevious}
				disabled={isFirstStep || isSubmitting}
				fullWidth
			>
				{buttonLabels.previous}
			</Button>

			<Button
				variant="primary"
				size={"md"}
				onClick={onNext}
				disabled={isSubmitting}
				fullWidth
			>
				{isSubmitting
					? buttonLabels.submitting
					: isLastStep
						? buttonLabels.submit
						: buttonLabels.next}
			</Button>
		</div>
	);
}
