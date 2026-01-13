"use client";

import { cn } from "@/utils/cn";
import { cloneElement } from "react";

type IconPosition = "left" | "right";

type InputProps = React.ComponentProps<"input"> & {
	className?: string;
	icon?: React.ReactNode;
	iconPosition?: IconPosition;
	connected?: boolean;
	rightElement?: React.ReactNode;
};

export const Input = ({
	className,
	type = "text",
	icon,
	iconPosition = "left",
	connected,
	rightElement,
	...props
}: InputProps) => {
	return (
		<div className="w-full relative">
			{icon && (
				<div
					className={cn(
						"absolute left-4 top-1/2 -translate-y-1/2 text-text-300",
						iconPosition === "left" && "left-4",
						iconPosition === "right" && "right-4",
					)}
				>
					{icon}
				</div>
			)}

			<input
				type={type}
				className={cn(
					"bg-background-input border w-full border-stroke-25 text-text-100 px-4 py-3 rounded-lg",
					icon && iconPosition === "left" && "pl-12",
					connected && "pr-[calc(var(--connected-element-width)+16px)]",
					className,
				)}
				style={
					{
						"--connected-element-width":
							connected && rightElement
								? "var(--actual-element-width, 120px)"
								: "0px",
					} as React.CSSProperties
				}
				{...props}
			/>

			{connected && rightElement && (
				<div
					className="absolute right-1 top-1/2 -translate-y-1/2"
					ref={(el) => {
						if (el) {
							const width = el.getBoundingClientRect().width;
							el.style.setProperty("--actual-element-width", `${width}px`);
						}
					}}
				>
					{cloneElement(rightElement as React.ReactElement, {
						className: cn(
							"rounded-md",
							(rightElement as React.ReactElement).props.className,
						),
					})}
				</div>
			)}
		</div>
	);
};
