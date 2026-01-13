"use client";

import { DialogHeadingIcon } from "@/components/ui/dialog-heading-icon";
import { cn } from "@/utils/cn";

type BaseStepLayoutProps = {
	children: React.ReactNode;
	className?: string;
};

export const BaseStepLayout = ({
	children,
	className,
}: BaseStepLayoutProps) => {
	return <div className={cn("w-full", className)}>{children}</div>;
};

// Used just in providers/registration flow as we need dynamic layouts
// TODO: See if this can replace FormStepCard component for other steps multistep forms

export const FormStepLayout = ({
	children,
	className,
}: BaseStepLayoutProps) => {
	return (
		<div
			className={cn(
				"inline-flex rounded-xl bg-background-base pt-3 pb-8 px-8 border border-stroke-25 flex-col items-center w-full max-w-[800px]",
				className,
			)}
		>
			<DialogHeadingIcon className="max-w-56 w-full" iconName="Sparkles" />
			{children}
		</div>
	);
};

// Preview variant with full width and no form-specific styling
export const PreviewStepLayout = ({
	children,
	className,
}: BaseStepLayoutProps) => {
	return <div className={cn("w-full", className)}>{children}</div>;
};
