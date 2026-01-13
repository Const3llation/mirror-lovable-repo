import { cn } from "@/utils/cn";
import type React from "react";

interface GradientTextProps {
	children: React.ReactNode;
	className?: string;
	as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span";
	gradient?: "primary" | "secondary" | "custom";
}

const gradientStyles = {
	primary: "bg-gradient-to-t from-purple-500 to-gray-100",
	secondary: "bg-gradient-2",
	custom: "",
} as const;

export const GradientText = ({
	children,
	className,
	as: Component = "p",
	gradient = "primary",
}: GradientTextProps) => {
	return (
		<Component
			className={cn(
				"text-transparent bg-clip-text inline-block",
				gradientStyles[gradient],
				className,
			)}
		>
			{children}
		</Component>
	);
};
