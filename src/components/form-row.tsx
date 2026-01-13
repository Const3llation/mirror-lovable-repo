import React from "react";

import { cn } from "@/utils/cn";

type FormRowProps = {
	dir?: "vertical" | "horizontal";
	children: React.ReactNode;
	className?: string;
};

export function FormRow({
	children,
	className,
	dir = "horizontal",
}: FormRowProps) {
	return (
		<div
			className={cn(
				"flex flex-col md:flex-row gap-6",
				dir === "vertical" && "flex-col gap-y-6",
				className,
			)}
		>
			{React.Children.map(children, (child) => (
				<div className="flex-1">{child}</div>
			))}
		</div>
	);
}
