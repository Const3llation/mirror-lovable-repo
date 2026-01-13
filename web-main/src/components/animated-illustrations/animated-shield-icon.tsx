import Image from "next/image";
import styles from "./animated-shield-icon.module.css";

interface ShieldIconAnimationProps {
	className?: string;
	size?: number;
	backgroundImage?: string;
}

export default function ShieldIconAnimation({
	className,
	size = 104,
	backgroundImage = "/words.webp",
}: ShieldIconAnimationProps) {
	const aspectRatio = 110 / 104;
	const height = size * aspectRatio;
	const backgroundSize = size * 1.6;

	return (
		<div className={styles.shieldContainer}>
			<div className={styles.svgWrapper} style={{ width: size, height }}>
				<svg
					width={size}
					height={height}
					viewBox="0 0 104 110"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={`${styles.shieldIcon} ${className || ""}`}
					role="img"
					aria-labelledby="shieldTitle shieldDesc"
				>
					<title id="shieldTitle">Security Shield Icon</title>
					<desc id="shieldDesc">
						An animated shield icon representing security and protection
					</desc>

					<defs>
						<linearGradient
							id="shieldGradient"
							x1="52"
							y1="0"
							x2="52"
							y2="110"
							gradientUnits="userSpaceOnUse"
						>
							<stop offset="0%" stopColor="rgba(255, 255, 255, 0.25)" />
							<stop offset="50%" stopColor="rgba(255, 255, 255, 0.15)" />
							<stop offset="100%" stopColor="rgba(255, 255, 255, 0.05)" />
						</linearGradient>

						<filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
							<feGaussianBlur in="SourceGraphic" stdDeviation="4" />
							<feComposite in="SourceGraphic" operator="over" />
						</filter>

						<radialGradient id="centerGlow" cx="0.5" cy="0.5" r="0.5">
							<stop offset="0%" stopColor="rgba(255, 255, 255, 0.4)" />
							<stop offset="100%" stopColor="rgba(255, 255, 255, 0.1)" />
						</radialGradient>
					</defs>

					<g className={styles.shieldGroup}>
						{/* Outer Shield */}
						<path
							className={styles.shieldOuter}
							d="M51.8903 1C65.1171 13.3995 82.3802 19.8554 100.022 19C102.591 28.2581 103.377 37.9688 102.333 47.5551C101.29 57.1414 98.4384 66.4076 93.9485 74.8032C89.4585 83.1987 83.4217 90.5523 76.1966 96.4269C68.9715 102.301 60.7057 106.577 51.8903 109C43.0749 106.577 34.809 102.301 27.584 96.4269C20.3589 90.5523 14.322 83.1987 9.8321 74.8032C5.34217 66.4076 2.4908 57.1414 1.44742 47.5551C0.404048 37.9688 1.18996 28.2581 3.75846 19C21.4004 19.8554 38.6635 13.3995 51.8903 1Z"
							fill="url(#shieldGradient)"
							stroke="rgba(255, 255, 255, 0.3)"
							strokeWidth="1"
						/>

						{/* Middle Shield */}
						<path
							className={styles.shieldMiddle}
							d="M52.0159 13C62.1564 22.5579 75.3915 27.5344 88.917 26.875C90.8862 34.0114 91.4887 41.4968 90.6888 48.8862C89.8888 56.2756 87.7028 63.4184 84.2605 69.8899C80.8182 76.3615 76.19 82.0299 70.6507 86.5582C65.1115 91.0865 58.7744 94.3824 52.0159 96.25C45.2574 94.3824 38.9203 91.0865 33.381 86.5582C27.8418 82.0299 23.2136 76.3615 19.7713 69.8899C16.329 63.4184 14.1429 56.2756 13.343 48.8862C12.5431 41.4968 13.1456 34.0114 15.1148 26.875C28.6403 27.5344 41.8753 22.5579 52.0159 13Z"
							fill="url(#shieldGradient)"
							stroke="rgba(255, 255, 255, 0.4)"
							strokeWidth="1"
						/>

						{/* Inner Shield */}
						<path
							className={styles.shieldInner}
							d="M52.1415 26C59.1958 32.7164 68.4028 36.2133 77.8118 35.75C79.1817 40.7648 79.6008 46.0248 79.0444 51.2173C78.4879 56.4099 76.9672 61.4291 74.5725 65.9767C72.1779 70.5243 68.9582 74.5075 65.1049 77.6896C61.2515 80.8716 56.843 83.1877 52.1415 84.5C47.4399 83.1877 43.0315 80.8716 39.1781 77.6896C35.3247 74.5075 32.1051 70.5243 29.7105 65.9767C27.3158 61.4291 25.7951 56.4099 25.2386 51.2173C24.6822 46.0248 25.1013 40.7648 26.4712 35.75C35.8802 36.2133 45.0872 32.7164 52.1415 26Z"
							fill="url(#shieldGradient)"
							stroke="rgba(255, 255, 255, 0.5)"
							strokeWidth="1"
						/>

						{/* Center Shield */}
						<path
							className={styles.shieldCenter}
							d="M51.7114 41C55.0152 44.2147 59.3272 45.8884 63.7338 45.6667C64.3754 48.0669 64.5717 50.5845 64.3111 53.0698C64.0505 55.5552 63.3383 57.9575 62.2168 60.1342C61.0953 62.3108 59.5874 64.2173 57.7827 65.7403C55.978 67.2633 53.9133 68.3719 51.7114 69C49.5095 68.3719 47.4449 67.2633 45.6402 65.7403C43.8355 64.2173 42.3276 62.3108 41.2061 60.1342C40.0846 57.9575 39.3724 55.5552 39.1118 53.0698C38.8511 50.5845 39.0474 48.0669 39.689 45.6667C44.0956 45.8884 48.4076 44.2147 51.7114 41Z"
							fill="url(#centerGlow)"
							stroke="rgba(255, 255, 255, 0.6)"
							strokeWidth="1.5"
						/>
					</g>
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
