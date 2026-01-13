import { cn } from "@/utils/cn";

/**
 * Type definitions for the Body component variants
 */
type BodyVariant =
	| "20-medium"
	| "18-medium"
	| "18-regular"
	| "16-medium"
	| "16-regular"
	| "16-bold"
	| "14-medium"
	| "14-regular"
	| "14-bold"
	| "12-regular"
	| "12-extralight";

interface BodyVariants {
	mobile?: BodyVariant;
	tablet?: BodyVariant;
	desktop?: BodyVariant;
	lgDesktop?: BodyVariant;
}

interface BodyProps {
	as?: keyof JSX.IntrinsicElements;
	variants?: BodyVariant | BodyVariants;
	children: React.ReactNode;
	className?: string;
}

/**
 * Static styles that Tailwind can detect at build time
 */
const BODY_STYLES = {
	"20-medium": {
		base: "text-xl font-medium leading-snug",
		md: "md:text-xl md:font-medium md:leading-snug",
		lg: "lg:text-xl lg:font-medium lg:leading-snug",
		xl: "xl:text-xl xl:font-medium xl:leading-snug",
	},
	"18-medium": {
		base: "text-lg font-medium leading-relaxed",
		md: "md:text-lg md:font-medium md:leading-relaxed",
		lg: "lg:text-lg lg:font-medium lg:leading-relaxed",
		xl: "xl:text-lg xl:font-medium xl:leading-relaxed",
	},
	"18-regular": {
		base: "text-lg font-normal leading-relaxed",
		md: "md:text-lg md:font-normal md:leading-relaxed",
		lg: "lg:text-lg lg:font-normal lg:leading-relaxed",
		xl: "xl:text-lg xl:font-normal xl:leading-relaxed",
	},
	"16-medium": {
		base: "text-base font-medium leading-normal",
		md: "md:text-base md:font-medium md:leading-normal",
		lg: "lg:text-base lg:font-medium lg:leading-normal",
		xl: "xl:text-base xl:font-medium xl:leading-normal",
	},
	"16-regular": {
		base: "text-base font-normal leading-normal",
		md: "md:text-base md:font-normal md:leading-normal",
		lg: "lg:text-base lg:font-normal lg:leading-normal",
		xl: "xl:text-base xl:font-normal xl:leading-normal",
	},
	"16-bold": {
		base: "text-base font-bold leading-normal",
		md: "md:text-base md:font-bold md:leading-normal",
		lg: "lg:text-base lg:font-bold lg:leading-normal",
		xl: "xl:text-base xl:font-bold xl:leading-normal",
	},
	"14-medium": {
		base: "text-sm font-medium leading-normal",
		md: "md:text-sm md:font-medium md:leading-normal",
		lg: "lg:text-sm lg:font-medium lg:leading-normal",
		xl: "xl:text-sm xl:font-medium xl:leading-normal",
	},
	"14-regular": {
		base: "text-sm font-normal leading-normal",
		md: "md:text-sm md:font-normal md:leading-normal",
		lg: "lg:text-sm lg:font-normal lg:leading-normal",
		xl: "xl:text-sm xl:font-normal xl:leading-normal",
	},
	"14-bold": {
		base: "text-sm font-bold leading-normal",
		md: "md:text-sm md:font-bold md:leading-normal",
		lg: "lg:text-sm lg:font-bold lg:leading-normal",
		xl: "xl:text-sm xl:font-bold xl:leading-normal",
	},
	"12-regular": {
		base: "text-xs font-normal leading-tight",
		md: "md:text-xs md:font-normal md:leading-tight",
		lg: "lg:text-xs lg:font-normal lg:leading-tight",
		xl: "xl:text-xs xl:font-normal xl:leading-tight",
	},
	"12-extralight": {
		base: "text-xs font-extralight leading-tight",
		md: "md:text-xs md:font-extralight md:leading-tight",
		lg: "lg:text-xs lg:font-extralight lg:leading-tight",
		xl: "xl:text-xs xl:font-extralight xl:leading-tight",
	},
} as const;

/**
 * A responsive body text component that applies appropriate typography styles
 * across different breakpoints using predefined Tailwind classes.
 */
export function Body({
	as: Tag = "p",
	variants,
	children,
	className,
}: BodyProps) {
	// Helper function to get styles for a specific variant
	const getStylesForVariant = (variant: BodyVariant) => {
		const styles = BODY_STYLES[variant];
		// Remove leading classes so they can be overridden
		const baseWithoutLeading = styles.base.replace(/leading-\w+/, "");
		const mdWithoutLeading = styles.md.replace(/md:leading-\w+/, "");
		const lgWithoutLeading = styles.lg.replace(/lg:leading-\w+/, "");
		const xlWithoutLeading = styles.xl.replace(/xl:leading-\w+/, "");

		return cn(
			baseWithoutLeading,
			mdWithoutLeading,
			lgWithoutLeading,
			xlWithoutLeading,
		);
	};

	// Determine the styles based on variants prop
	const getResponsiveStyles = () => {
		// If variants is undefined, use default variant
		if (!variants) {
			return getStylesForVariant("16-regular");
		}

		// If variants is a string (single variant), use that variant
		if (typeof variants === "string") {
			return getStylesForVariant(variants);
		}

		// For responsive variants, combine styles from different breakpoints
		const mobileVariant = variants.mobile || "16-regular";
		const tabletVariant = variants.tablet || mobileVariant;
		const desktopVariant = variants.desktop || tabletVariant;
		const lgDesktopVariant = variants.lgDesktop || desktopVariant;

		const mobileStyles = BODY_STYLES[mobileVariant];
		const tabletStyles = BODY_STYLES[tabletVariant];
		const desktopStyles = BODY_STYLES[desktopVariant];
		const lgDesktopStyles = BODY_STYLES[lgDesktopVariant];

		return cn(
			mobileStyles.base,
			tabletStyles.md,
			desktopStyles.lg,
			lgDesktopStyles.xl,
		);
	};

	return <Tag className={cn(getResponsiveStyles(), className)}>{children}</Tag>;
}
