"use client";

import { Icon } from "@/components/ui/icon";
import type { FormStepConfig } from "@/features/service-providers/config/forms/registration";
import type { FormStepId } from "@/features/service-providers/config/forms/registration";
import { cn } from "@/utils/cn";
import { useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

interface FormStepperProps {
	steps: FormStepConfig[];
	currentStepId: FormStepId;
	className?: string;
}

export function FormStepper({
	steps,
	currentStepId,
	className,
}: FormStepperProps) {
	const [isMounted, setIsMounted] = React.useState(false);
	const router = useRouter();
	const searchParams = useSearchParams();

	React.useEffect(() => {
		setIsMounted(true);
	}, []);

	const handleStepClick = React.useCallback(
		(
			stepId: string,
			isCompleted: boolean | undefined,
			isActive: boolean,
			e: React.MouseEvent,
		) => {
			e.preventDefault();
			if (!isCompleted && !isActive) return;

			const params = new URLSearchParams(searchParams);
			params.set("step", stepId);
			router.replace(`?${params.toString()}`, { scroll: false });
		},
		[router, searchParams],
	);

	if (!isMounted) {
		return (
			<nav aria-label="Progress" className={cn("w-full mx-auto", className)}>
				<ol className="flex items-center opacity-0">
					{steps.map((step) => (
						<li
							key={step.id}
							className="relative flex flex-col items-center flex-1"
						/>
					))}
				</ol>
			</nav>
		);
	}

	return (
		<nav aria-label="Progress" className={cn("w-full mx-auto", className)}>
			<ol className="flex items-center">
				{steps.map((step, index) => {
					const isActive = step.id === currentStepId;
					const isCompleted =
						steps.findIndex((s) => s.id === currentStepId) >
						steps.findIndex((s) => s.id === step.id);

					return (
						<li
							key={step.id}
							className={cn(
								"relative flex flex-col items-center flex-1",
								index !== steps.length - 1 &&
									"after:absolute after:top-4 after:h-[2px] after:w-full after:left-[50%] after:bg-stroke-200 after:z-0",
							)}
						>
							<div
								className={cn(
									"relative flex items-center justify-center w-8 h-8 rounded-full z-10",
									isActive && "bg-primary-100/25",
								)}
							>
								<div
									className={cn(
										"w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium border-2 border-stroke-200 bg-background-300 z-20",
										(isActive || isCompleted) &&
											"bg-primary-100 border-primary-100",
									)}
								>
									{isCompleted ? (
										<Icon
											name="Check"
											width={16}
											height={16}
											className="text-primary-300"
										/>
									) : (
										<span
											className={cn(
												"w-2 h-2 rounded-full bg-primary-100",
												isActive && "bg-primary-300",
											)}
										/>
									)}
								</div>
							</div>
							<button
								type="button"
								onClick={(e) =>
									handleStepClick(step.id, isCompleted, isActive, e)
								}
								className={cn(
									"mt-3 text-sm font-medium text-center",
									isActive || isCompleted
										? "text-primary-100"
										: "text-text-300",
									!isCompleted && !isActive && "pointer-events-none opacity-50",
								)}
							>
								{step.title}
							</button>
						</li>
					);
				})}
			</ol>
		</nav>
	);
}
