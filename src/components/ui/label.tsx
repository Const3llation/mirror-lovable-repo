import { cn } from "@/utils/cn";

/**
 * Extends native label attributes while requiring the htmlFor attribute for accessibility.
 */
type LabelProps = React.ComponentProps<"label"> & {
	/**
	 * ID of the form element this label is tied to.
	 * Required for accessibility and form association.
	 */
	htmlFor: string;
};

/**
 * Provides consistent styling for form labels while maintaining accessibility.
 *
 * @example
 * // Basic usage
 * <Label htmlFor="email">Email address</Label>
 * <Input id="email" type="email" />
 *
 * @example
 * // With custom styling
 * <Label htmlFor="name" className="text-primary-500">
 *   Full name
 * </Label>
 *
 * @example
 * // With required indicator
 * <Label htmlFor="password">
 *   Password <span className="text-red-500">*</span>
 * </Label>
 */
export const Label = ({ children, className, ...props }: LabelProps) => {
	return (
		<label
			className={cn("text-sm font-medium text-text-200", className)}
			{...props}
		>
			{children}
		</label>
	);
};
