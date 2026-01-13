import { cn } from "@/utils/cn";

/**
 * Type definitions for heading levels and variants
 */
type HeadingLevel = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface HeadingVariants {
	mobile?: HeadingLevel;
	tablet?: HeadingLevel;
	desktop?: HeadingLevel;
	lgDesktop?: HeadingLevel;
}

interface HeadingProps {
	as?: HeadingLevel;
	variants?: HeadingLevel | HeadingVariants;
	children: React.ReactNode;
	className?: string;
}

/**
 * Static variant classes that Tailwind can detect at build time
 */
const HEADING_STYLES = {
	h1: {
		base: "text-4xl font-semibold leading-tight",
		md: "md:text-5xl md:leading-tight",
		lg: "lg:text-5xl lg:leading-tight",
		xl: "xl:text-6xl xl:leading-snug",
	},
	h2: {
		base: "text-3xl font-semibold leading-normal",
		md: "md:text-4xl md:leading-snug",
		lg: "lg:text-4xl lg:leading-snug",
		xl: "xl:text-5xl xl:leading-snug",
	},
	h3: {
		base: "text-2xl font-semibold leading-normal",
		md: "md:text-3xl md:leading-normal",
		lg: "lg:text-3xl lg:leading-normal",
		xl: "xl:text-3xl xl:leading-normal",
	},
	h4: {
		base: "text-xl font-semibold leading-normal",
		md: "md:text-2xl md:leading-normal",
		lg: "lg:text-2xl lg:leading-normal",
		xl: "xl:text-2xl xl:leading-normal",
	},
	h5: {
		base: "text-base font-medium leading-normal",
		md: "md:text-lg md:leading-normal",
		lg: "lg:text-xl lg:leading-normal",
		xl: "xl:text-xl xl:leading-normal",
	},
	h6: {
		base: "text-sm font-medium leading-normal",
		md: "md:text-base md:leading-normal",
		lg: "lg:text-base lg:leading-normal",
		xl: "xl:text-lg xl:leading-normal",
	},
} as const;

/**
 * A responsive heading component that applies appropriate typography styles
 * across different breakpoints using predefined Tailwind classes.
 */
export function Heading({
	as: Tag = "h1",
	variants,
	children,
	className,
}: HeadingProps) {
	// Helper function to get styles for a specific heading level
	const getStylesForLevel = (level: HeadingLevel) => {
		const styles = HEADING_STYLES[level];
		return cn(styles.base, styles.md, styles.lg, styles.xl);
	};

	// Determine the styles based on variants prop
	const getResponsiveStyles = () => {
		// If variants is undefined, use the Tag prop
		if (!variants) {
			return getStylesForLevel(Tag);
		}

		// If variants is a string (single heading level), use that level
		if (typeof variants === "string") {
			return getStylesForLevel(variants);
		}

		// For responsive variants, combine styles from different breakpoints
		const mobileLevel = variants.mobile || Tag;
		const tabletLevel = variants.tablet || mobileLevel;
		const desktopLevel = variants.desktop || tabletLevel;
		const lgDesktopLevel = variants.lgDesktop || desktopLevel;

		const mobileStyles = HEADING_STYLES[mobileLevel];
		const tabletStyles = HEADING_STYLES[tabletLevel];
		const desktopStyles = HEADING_STYLES[desktopLevel];
		const lgDesktopStyles = HEADING_STYLES[lgDesktopLevel];

		return cn(
			mobileStyles.base,
			tabletStyles.md,
			desktopStyles.lg,
			lgDesktopStyles.xl,
		);
	};

	return (
		<Tag
			className={cn(getResponsiveStyles(), "text-text-100 relative", className)}
		>
			{children}
		</Tag>
	);
}
