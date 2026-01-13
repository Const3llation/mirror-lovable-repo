"use client";

import { cn } from "@/utils/cn";

type FormStepCardProps = {
	children: React.ReactNode;
	className?: string;
};

export const FormStepCard = ({ children, className }: FormStepCardProps) => {
	return (
		<div
			className={cn(
				"inline-flex rounded-xl bg-background-base pb-8 px-8 border border-stroke-25 flex-col items-center w-full max-w-[800px]",
				className,
			)}
		>
			<div className="w-[177px] h-[119px] bg-[url('/dialog-heading-icon.webp')] bg-cover bg-no-repeat bg-center" />
			{children}
		</div>
	);
};
