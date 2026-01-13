import { buttonVariants } from "@/components/ui/button";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";

/**
 * Props for the Button component.
 * Extends native button attributes and CVA variants.
 */
export interface ButtonProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof buttonVariants> {
	/**
	 * Optional icon element to be rendered on the right side of the button text
	 */
	iconRight?: React.ReactElement;

	/**
	 * Optional icon element to be rendered on the left side of the button text
	 */
	iconLeft?: React.ReactElement;

	/**
	 * The URL to link to when the button is clicked.
	 */
	href: string;
}

/**
 * Button component that follows design system specifications.
 * Supports different variants, sizes, and can be rendered as a different element via asChild.
 *
 * @example
 * // Primary button (default)
 * <Button>Click me</Button>
 *
 * @example
 * // Secondary button with icon
 * <Button variant="secondary" iconRight={<ArrowRight />}>
 *   Next
 * </Button>
 *
 * @example
 * // Small link-style button
 * <Button variant="link" size="sm">
 *   Learn more
 * </Button>
 *
 * @example
 * // Full width button
 * <Button fullWidth>
 *   Submit
 * </Button>
 */
const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			fullWidth,
			iconRight,
			iconLeft,
			children,
			href,
			...props
		},
		ref,
	) => {
		return (
			<Link
				href={href}
				className={buttonVariants({ variant, size, fullWidth, className })}
				ref={ref}
				{...props}
			>
				{iconLeft && <span className="mr-2">{iconLeft}</span>}
				{children}
				{iconRight && <span className="ml-2">{iconRight}</span>}
			</Link>
		);
	},
);

ButtonLink.displayName = "Button";

export { ButtonLink };
