import Image from "next/image";
import styles from "./animated-radial-message-icon.module.css";

interface MessageIconAnimationProps {
	className?: string;
	size?: number;
	backgroundImage?: string;
}

export default function MessageIconAnimation({
	className,
	size = 108,
	backgroundImage = "/grid.webp",
}: MessageIconAnimationProps) {
	const aspectRatio = 108 / 108;
	const height = size * aspectRatio;
	const backgroundSize = size * 1.6;

	return (
		<div className={styles.messageContainer}>
			<div className={styles.svgWrapper} style={{ width: size, height }}>
				<svg
					width={size}
					height={height}
					viewBox="0 0 108 108"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={`${styles.messageIcon} ${className || ""}`}
					role="img"
					aria-labelledby="messageTitle messageDesc"
				>
					<title id="messageTitle">Message Icon</title>
					<desc id="messageDesc">
						An animated message icon representing communication and interaction
					</desc>

					<defs>
						<linearGradient
							id="messageGradient"
							x1="54.4666"
							y1="40"
							x2="54.4666"
							y2="68"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="white" />
							<stop offset="1" stopColor="#555358" />
						</linearGradient>

						<clipPath id="bgblur_0_clip_path">
							<path
								transform="translate(2.1 2.1)"
								d="M108 54C108 83.8234 83.8234 108 54 108C24.1766 108 0 83.8234 0 54C0 24.1766 24.1766 0 54 0C83.8234 0 108 24.1766 108 54Z"
							/>
						</clipPath>

						<clipPath id="bgblur_1_clip_path">
							<path
								transform="translate(-9.9 -9.9)"
								d="M97 54.5C97 77.9721 77.9721 97 54.5 97C31.0279 97 12 77.9721 12 54.5C12 31.0279 31.0279 12 54.5 12C77.9721 12 97 31.0279 97 54.5Z"
							/>
						</clipPath>

						<clipPath id="bgblur_2_clip_path">
							<path
								transform="translate(-21.9 -21.9)"
								d="M84 54C84 70.5685 70.5685 84 54 84C37.4315 84 24 70.5685 24 54C24 37.4315 37.4315 24 54 24C70.5685 24 84 37.4315 84 54Z"
							/>
						</clipPath>
					</defs>

					<g className={styles.messageGroup}>
						{/* Outer Circle */}
						<g className={styles.messageOuter}>
							<foreignObject x="-2.1" y="-2.1" width="112.2" height="112.2">
								<div
									style={{
										backdropFilter: "blur(1.05px)",
										clipPath: "url(#bgblur_0_clip_path)",
										height: "100%",
										width: "100%",
									}}
								/>
							</foreignObject>
							<path
								d="M108 54C108 83.8234 83.8234 108 54 108C24.1766 108 0 83.8234 0 54C0 24.1766 24.1766 0 54 0C83.8234 0 108 24.1766 108 54Z"
								fill="white"
								fillOpacity="0.1"
							/>
							<path
								d="M107.5 54C107.5 83.5472 83.5472 107.5 54 107.5C24.4528 107.5 0.5 83.5472 0.5 54C0.5 24.4528 24.4528 0.5 54 0.5C83.5472 0.5 107.5 24.4528 107.5 54Z"
								stroke="white"
								strokeOpacity="0.04"
							/>
						</g>

						{/* Middle Circle */}
						<g className={styles.messageMiddle}>
							<foreignObject x="9.9" y="9.9" width="89.2" height="89.2">
								<div
									style={{
										backdropFilter: "blur(1.05px)",
										clipPath: "url(#bgblur_1_clip_path)",
										height: "100%",
										width: "100%",
									}}
								/>
							</foreignObject>
							<path
								d="M97 54.5C97 77.9721 77.9721 97 54.5 97C31.0279 97 12 77.9721 12 54.5C12 31.0279 31.0279 12 54.5 12C77.9721 12 97 31.0279 97 54.5Z"
								fill="white"
								fillOpacity="0.03"
							/>
							<path
								d="M96.5 54.5C96.5 77.696 77.696 96.5 54.5 96.5C31.304 96.5 12.5 77.696 12.5 54.5C12.5 31.304 31.304 12.5 54.5 12.5C77.696 12.5 96.5 31.304 96.5 54.5Z"
								stroke="white"
								strokeOpacity="0.04"
							/>
						</g>

						{/* Inner Circle */}
						<g className={styles.messageInner}>
							<foreignObject x="21.9" y="21.9" width="64.2" height="64.2">
								<div
									style={{
										backdropFilter: "blur(1.05px)",
										clipPath: "url(#bgblur_2_clip_path)",
										height: "100%",
										width: "100%",
									}}
								/>
							</foreignObject>
							<path
								d="M84 54C84 70.5685 70.5685 84 54 84C37.4315 84 24 70.5685 24 54C24 37.4315 37.4315 24 54 24C70.5685 24 84 37.4315 84 54Z"
								fill="white"
								fillOpacity="0.03"
							/>
							<path
								d="M83.5 54C83.5 70.2924 70.2924 83.5 54 83.5C37.7076 83.5 24.5 70.2924 24.5 54C24.5 37.7076 37.7076 24.5 54 24.5C70.2924 24.5 83.5 37.7076 83.5 54Z"
								stroke="white"
								strokeOpacity="0.04"
							/>
						</g>

						{/* Message Icon */}
						<path
							className={styles.messageIconPath}
							d="M63.1466 40C64.6814 40 66.1532 40.6211 67.2384 41.7265C68.3236 42.832 68.9333 44.3314 68.9333 45.8948V57.6843C68.9333 59.2477 68.3236 60.7471 67.2384 61.8526C66.1532 62.9581 64.6814 63.5791 63.1466 63.5791H59.4056L55.4894 67.5684C55.2403 67.8221 54.9089 67.9746 54.5573 67.9971C54.2057 68.0196 53.8582 67.9107 53.5798 67.6907L53.4438 67.5684L49.5263 63.5791H45.7866C44.302 63.5791 42.8742 62.9978 41.7984 61.9555C40.7227 60.9132 40.0814 59.4896 40.0072 57.9791L40 57.6843V45.8948C40 44.3314 40.6096 42.832 41.6948 41.7265C42.7801 40.6211 44.2519 40 45.7866 40H63.1466ZM57.36 53.2633H48.68C48.2963 53.2633 47.9283 53.4185 47.657 53.6949C47.3857 53.9713 47.2333 54.3461 47.2333 54.7369C47.2333 55.1278 47.3857 55.5026 47.657 55.779C47.9283 56.0554 48.2963 56.2106 48.68 56.2106H57.36C57.7436 56.2106 58.1116 56.0554 58.3829 55.779C58.6542 55.5026 58.8066 55.1278 58.8066 54.7369C58.8066 54.3461 58.6542 53.9713 58.3829 53.6949C58.1116 53.4185 57.7436 53.2633 57.36 53.2633ZM60.2533 47.3685H48.68C48.2963 47.3685 47.9283 47.5237 47.657 47.8001C47.3857 48.0765 47.2333 48.4513 47.2333 48.8422C47.2333 49.233 47.3857 49.6079 47.657 49.8842C47.9283 50.1606 48.2963 50.3159 48.68 50.3159H60.2533C60.637 50.3159 61.0049 50.1606 61.2763 49.8842C61.5476 49.6079 61.7 49.233 61.7 48.8422C61.7 48.4513 61.5476 48.0765 61.2763 47.8001C61.0049 47.5237 60.637 47.3685 60.2533 47.3685Z"
							fill="url(#messageGradient)"
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
