"use client";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import type { FormStepId } from "@/features/service-providers/config/forms/registration";
import type { FormStepConfig } from "@/types/form";
import { cn } from "@/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

interface MobileStepperProps {
	steps: FormStepConfig[];
	currentStepId: FormStepId;
	className?: string;
}

const StepIndicator = ({
	number,
	isCompleted,
}: { number: number; isCompleted: boolean }) => (
	<div
		className={cn(
			"flex items-center justify-center w-8 h-8 rounded-full border",
			isCompleted
				? "bg-primary-100 border-primary-100"
				: "bg-background-100 border-stroke-50",
		)}
	>
		{isCompleted ? (
			<Icon
				name="Check"
				width={16}
				height={16}
				className="text-background-300"
			/>
		) : (
			<span className="text-xs font-bold text-text-100">{number}</span>
		)}
	</div>
);

const CurrentStep = ({
	currentStep,
	totalSteps,
	isOpen,
	onClick,
	steps,
}: {
	currentStep: FormStepConfig;
	totalSteps: number;
	isOpen: boolean;
	onClick: () => void;
	steps: FormStepConfig[];
}) => (
	<button
		type="button"
		onClick={onClick}
		className="w-full flex items-center justify-between px-6 py-3 bg-background-100 rounded-lg text-text-100"
	>
		<span className="flex items-center gap-2">
			<span>{`${steps.findIndex((step) => step.id === currentStep.id) + 1} of ${totalSteps}`}</span>
			<span>{currentStep.title}</span>
		</span>
		<Icon
			name="ChevronDown"
			width={16}
			height={16}
			className={cn("w-5 h-5 transition-transform", isOpen && "rotate-180")}
		/>
	</button>
);

const StepDrawer = ({
	steps,
	currentStepId,
	isOpen,
	onClose,
	onStepClick,
}: {
	steps: FormStepConfig[];
	currentStepId: FormStepId;
	isOpen: boolean;
	onClose: () => void;
	onStepClick: (stepId: string) => void;
}) => {
	const currentStepRef = React.useRef<HTMLLIElement>(null);

	React.useEffect(() => {
		if (isOpen && currentStepRef.current) {
			currentStepRef.current.scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}
	}, [isOpen]);

	return (
		<div
			className={cn(
				"fixed inset-x-0 bottom-0 transform transition-transform duration-300 ease-in-out bg-background-100 rounded-t-3xl z-overlay",
				isOpen ? "translate-y-0" : "translate-y-full",
			)}
		>
			<div className="p-4 space-y-4">
				<ul className="space-y-1">
					{steps.map((step, index) => {
						const isCompleted =
							steps.findIndex((s) => s.id === currentStepId) > index;
						const isActive = step.id === currentStepId;

						return (
							<li key={step.id} ref={isActive ? currentStepRef : null}>
								<button
									type="button"
									onClick={() => {
										if (isActive) {
											onClose();
										} else {
											onStepClick(step.id);
										}
									}}
									disabled={!isCompleted && !isActive}
									className={cn(
										"w-full flex items-center gap-3 px-4 py-2 rounded-lg text-md",
										"transition-colors",
										isActive || isCompleted
											? "text-primary-100"
											: "text-text-300",
									)}
								>
									<StepIndicator number={index + 1} isCompleted={isCompleted} />
									<span>{step.title}</span>
								</button>
							</li>
						);
					})}
				</ul>
				<Button type="button" variant="secondary" onClick={onClose} fullWidth>
					Close
				</Button>
			</div>
		</div>
	);
};

export function MobileStepper({
	steps,
	currentStepId,
	className,
}: MobileStepperProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const [isMounted, setIsMounted] = React.useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleStepClick = React.useCallback(
		(stepId: string) => {
			const params = new URLSearchParams(searchParams);
			params.set("step", stepId);
			router.replace(`?${params.toString()}`, { scroll: false });
			setIsOpen(false);
		},
		[router, searchParams],
	);

	if (!isMounted) {
		return null;
	}

	const currentStep = steps.find((step) => step.id === currentStepId);
	if (!currentStep) return null;

	return (
		<>
			<div className={cn("w-full relative z-50", className)}>
				<CurrentStep
					currentStep={currentStep}
					totalSteps={steps.length}
					isOpen={isOpen}
					onClick={() => setIsOpen(!isOpen)}
					steps={steps}
				/>
			</div>

			{isOpen && (
				<div className="fixed inset-0" onClick={() => setIsOpen(false)} />
			)}

			<StepDrawer
				steps={steps}
				currentStepId={currentStepId}
				isOpen={isOpen}
				onClose={() => setIsOpen(false)}
				onStepClick={handleStepClick}
			/>
		</>
	);
}
