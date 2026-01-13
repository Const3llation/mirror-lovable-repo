import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

/**
 * Button variants defining different styles combinations using class-variance-authority.
 * Includes styling for different visual variants, sizes, and width options.
 */
const buttonVariants = cva(
	"inline-flex items-center justify-center rounded-lg font-medium ring-offset-background-base transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stroke-200 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			/**
			 * Visual style variants of the button
			 * - primary: Main call-to-action style
			 * - secondary: Alternative, less prominent style
			 * - link: Text-only style with underline on hover
			 */
			variant: {
				primary:
					"bg-primary-200 border border-white/15 text-text-100 hover:bg-primary-300 hover:border-primary-100/15 active:border-primary-100/15 active:bg-primary-400",
				secondary:
					"bg-background-100 border border-stroke-100/20 text-text-100 hover:border-stroke-100 hover:bg-background-100",
				link: "text-primary-100 underline-offset-4 hover:text-primary-200 hover:underline",
			},
			/**
			 * Size variants affecting height, padding, and font size
			 * - lg: Large size (48px height)
			 * - md: Medium size (40px height)
			 * - sm: Small size (32px height)
			 */
			size: {
				lg: "py-4 px-8 text-base",
				md: "py-3 px-5 text-sm",
				sm: "h-8 px-3 text-sm",
				inline: "text-sm",
			},
			/**
			 * Width variant to make button fill its container
			 */
			fullWidth: {
				true: "w-full",
			},
		},
		defaultVariants: {
			variant: "primary",
			size: "lg",
			fullWidth: false,
		},
	},
);

/**
 * Props for the Button component.
 * Extends native button attributes and CVA variants.
 */
export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	/**
	 * When true, the component will render its child as the root element
	 * instead of wrapping it in a button. Useful for custom button-like components.
	 */
	asChild?: boolean;

	/**
	 * Optional icon element to be rendered on the right side of the button text
	 */
	iconRight?: React.ReactElement;

	/**
	 * Optional icon element to be rendered on the left side of the button text
	 */
	iconLeft?: React.ReactElement;
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
const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			fullWidth,
			asChild = false,
			iconRight,
			iconLeft,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={buttonVariants({ variant, size, fullWidth, className })}
				ref={ref}
				{...props}
			>
				{iconLeft && <span className="mr-2">{iconLeft}</span>}
				{children}
				{iconRight && <span className="ml-2">{iconRight}</span>}
			</Comp>
		);
	},
);

Button.displayName = "Button";

export { Button, buttonVariants };
