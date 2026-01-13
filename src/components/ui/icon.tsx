import * as icons from "./icons";

export type IconName = keyof typeof icons;

/**
 * Props for the Icon component.
 * Combines the icon name with standard SVG properties.
 */
type IconProps = {
	/**
	 * Name of the icon to render. Must be a key from the imported icons object.
	 * @example "chevronRight" | "search" | "close"
	 */
	name: IconName;
} & React.SVGProps<SVGSVGElement>;

/**
 * Icon component that dynamically renders SVG icons based on the provided name.
 * Supports all standard SVG attributes like size, color, etc.
 *
 * @example
 * // Basic usage
 * <Icon name="search" />
 *
 * @example
 * // With custom size and color
 * <Icon name="close" width={24} height={24} color="red" />
 *
 * @example
 * // With className for styling
 * <Icon name="chevronRight" className="text-primary-500" />
 */
export const Icon = ({ name, ...props }: IconProps) => {
	const IconComponent = icons[name];
	return <IconComponent {...props} />;
};
