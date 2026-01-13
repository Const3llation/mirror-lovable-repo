import Image from "next/image";
import styles from "./animated-diamond-icon.module.css"; // Reusing diamond styles

interface SparklesDiamondIconAnimationProps {
	className?: string;
	size?: number;
	backgroundImage?: string;
}

export default function SparklesDiamondIconAnimation({
	className,
	size = 115,
	backgroundImage = "/images/words.webp",
}: SparklesDiamondIconAnimationProps) {
	const aspectRatio = 115 / 115;
	const height = size * aspectRatio;
	const backgroundSize = size * 2;

	return (
		<div className={styles.diamondContainer}>
			<div className={styles.svgWrapper} style={{ width: size, height }}>
				<svg
					width={size}
					height={height}
					viewBox="0 0 115 115"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={`${styles.diamondIcon} ${className || ""}`}
					role="img"
					aria-labelledby="sparklesDiamondTitle sparklesDiamondDesc"
				>
					<title id="sparklesDiamondTitle">Sparkles Diamond Icon</title>
					<desc id="sparklesDiamondDesc">
						An animated diamond icon with sparkles representing premium features
					</desc>

					{/* Add your SVG content here */}
					{/* This is a placeholder for the actual SVG content */}
				</svg>
			</div>
			<div
				className={styles.imageWrapper}
				style={{ width: backgroundSize, height: backgroundSize }}
			>
				<Image
					src={backgroundImage}
					alt="Background texture"
					width={backgroundSize}
					height={backgroundSize}
					priority
				/>
			</div>
		</div>
	);
}
