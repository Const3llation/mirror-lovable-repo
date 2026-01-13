import Image from "next/image";
import styles from "./animated-radial-globe-icon.module.css";

interface GlobeIconAnimationProps {
	className?: string;
	size?: number;
	backgroundImage?: string;
}

export default function GlobeIconAnimation({
	className,
	size = 113,
	backgroundImage = "/words.webp",
}: GlobeIconAnimationProps) {
	const aspectRatio = 113 / 113;
	const height = size * aspectRatio;
	const backgroundSize = size * 1.6;

	return (
		<div className={styles.globeContainer}>
			<div className={styles.svgWrapper} style={{ width: size, height }}>
				<svg
					width={size}
					height={height}
					viewBox="0 0 113 113"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
					className={`${styles.globeIcon} ${className || ""}`}
					role="img"
					aria-labelledby="globeTitle globeDesc"
				>
					<title id="globeTitle">Globe Icon</title>
					<desc id="globeDesc">
						An animated globe icon representing global connectivity and reach
					</desc>

					<defs>
						<linearGradient
							id="globeGradient"
							x1="57"
							y1="43"
							x2="57"
							y2="71"
							gradientUnits="userSpaceOnUse"
						>
							<stop stopColor="#E8E6E9" />
							<stop offset="1" stopColor="#828183" />
						</linearGradient>

						<clipPath id="bgblur_0_clip_path">
							<path
								transform="translate(2.1 2.1)"
								d="M113 56.5C113 87.7041 87.7041 113 56.5 113C25.2959 113 0 87.7041 0 56.5C0 25.2959 25.2959 0 56.5 0C87.7041 0 113 25.2959 113 56.5Z"
							/>
						</clipPath>

						<clipPath id="bgblur_1_clip_path">
							<path
								transform="translate(-9.9 -9.9)"
								d="M102 57C102 81.8528 81.8528 102 57 102C32.1472 102 12 81.8528 12 57C12 32.1472 32.1472 12 57 12C81.8528 12 102 32.1472 102 57Z"
							/>
						</clipPath>

						<clipPath id="bgblur_2_clip_path">
							<path
								transform="translate(-22.9 -22.9)"
								d="M89 57C89 74.6731 74.6731 89 57 89C39.3269 89 25 74.6731 25 57C25 39.3269 39.3269 25 57 25C74.6731 25 89 39.3269 89 57Z"
							/>
						</clipPath>
					</defs>

					<g className={styles.globeGroup}>
						{/* Outer Circle */}
						<g className={styles.globeOuter}>
							<foreignObject x="-2.1" y="-2.1" width="117.2" height="117.2">
								<div
									style={{
										backdropFilter: "blur(1.05px)",
										clipPath: "url(#bgblur_0_clip_path)",
										height: "100%",
										width: "100%",
									}}
								/>
							</foreignObject>
							<mask id="path-1-inside-1" fill="white">
								<path d="M113 56.5C113 87.7041 87.7041 113 56.5 113C25.2959 113 0 87.7041 0 56.5C0 25.2959 25.2959 0 56.5 0C87.7041 0 113 25.2959 113 56.5Z" />
							</mask>
							<path
								d="M113 56.5C113 87.7041 87.7041 113 56.5 113C25.2959 113 0 87.7041 0 56.5C0 25.2959 25.2959 0 56.5 0C87.7041 0 113 25.2959 113 56.5Z"
								fill="#D9D9D9"
								fillOpacity="0.1"
								stroke="white"
								strokeOpacity="0.02"
								strokeWidth="2"
								mask="url(#path-1-inside-1)"
							/>
						</g>

						{/* Middle Circle */}
						<g className={styles.globeMiddle}>
							<foreignObject x="9.9" y="9.9" width="94.2" height="94.2">
								<div
									style={{
										backdropFilter: "blur(1.05px)",
										clipPath: "url(#bgblur_1_clip_path)",
										height: "100%",
										width: "100%",
									}}
								/>
							</foreignObject>
							<mask id="path-2-inside-2" fill="white">
								<path d="M102 57C102 81.8528 81.8528 102 57 102C32.1472 102 12 81.8528 12 57C12 32.1472 32.1472 12 57 12C81.8528 12 102 32.1472 102 57Z" />
							</mask>
							<path
								d="M102 57C102 81.8528 81.8528 102 57 102C32.1472 102 12 81.8528 12 57C12 32.1472 32.1472 12 57 12C81.8528 12 102 32.1472 102 57Z"
								fill="#D9D9D9"
								fillOpacity="0.03"
								stroke="white"
								strokeOpacity="0.02"
								strokeWidth="2"
								mask="url(#path-2-inside-2)"
							/>
						</g>

						{/* Inner Circle */}
						<g className={styles.globeInner}>
							<foreignObject x="22.9" y="22.9" width="68.2" height="68.2">
								<div
									style={{
										backdropFilter: "blur(1.05px)",
										clipPath: "url(#bgblur_2_clip_path)",
										height: "100%",
										width: "100%",
									}}
								/>
							</foreignObject>
							<mask id="path-3-inside-3" fill="white">
								<path d="M89 57C89 74.6731 74.6731 89 57 89C39.3269 89 25 74.6731 25 57C25 39.3269 39.3269 25 57 25C74.6731 25 89 39.3269 89 57Z" />
							</mask>
							<path
								d="M89 57C89 74.6731 74.6731 89 57 89C39.3269 89 25 74.6731 25 57C25 39.3269 39.3269 25 57 25C74.6731 25 89 39.3269 89 57Z"
								fill="#D9D9D9"
								fillOpacity="0.03"
								stroke="white"
								strokeOpacity="0.02"
								strokeWidth="2"
								mask="url(#path-3-inside-3)"
							/>
						</g>

						{/* Globe Icon - Background */}
						<path
							className={styles.globeIconPath}
							d="M69 61.8899C68.02 63.9214 66.5279 65.6792 64.6623 67L63.3328 65.7059C63.1904 65.5669 63.0124 65.4672 62.8172 65.4173L59.7677 64.6356C59.4974 64.5664 59.2628 64.4028 59.1087 64.1761C58.9546 63.9493 58.8919 63.6753 58.9326 63.4064L59.2706 61.169C59.2992 60.9803 59.3775 60.802 59.498 60.6514C59.6185 60.5009 59.777 60.3832 59.9581 60.3099L64.2844 58.5615C64.4843 58.4808 64.7037 58.4573 64.9168 58.4938C65.1299 58.5303 65.3279 58.6251 65.4875 58.7672L69 61.8899ZM61.1725 53.0909L64.3214 49.5277C64.4984 49.3279 64.5961 49.0732 64.5969 48.8095V45.4949C61.9623 43.6523 58.7381 42.7839 55.504 43.0457C52.2699 43.3076 49.2378 44.6825 46.9528 46.9233C44.6678 49.1642 43.2797 52.124 43.0379 55.2709C42.7961 58.4178 43.7166 61.5453 45.6338 64.0914L47.0428 63.1909C47.1989 63.0907 47.3271 62.9545 47.416 62.7945C47.505 62.6346 47.5519 62.4557 47.5527 62.2739L47.5826 57.2701C47.5841 57.0533 47.6507 56.8416 47.7743 56.6611L50.7485 52.3382C50.8338 52.2151 50.9437 52.11 51.0717 52.0291C51.1997 51.9482 51.3432 51.8933 51.4935 51.8675C51.6439 51.8417 51.798 51.8456 51.9467 51.8791C52.0955 51.9125 52.2357 51.9747 52.3592 52.062L55.1729 53.8574C55.4098 54.0234 55.703 54.095 55.9924 54.0577L60.4609 53.4693C60.7379 53.4326 60.9912 53.2979 61.1725 53.0909Z"
							fill="#454158"
						/>

						{/* Globe Icon - Foreground */}
						<path
							className={styles.globeIconPath}
							d="M57 43C54.2311 43 51.5243 43.8211 49.222 45.3594C46.9197 46.8978 45.1253 49.0843 44.0657 51.6424C43.0061 54.2006 42.7288 57.0155 43.269 59.7313C43.8092 62.447 45.1426 64.9416 47.1005 66.8995C49.0584 68.8574 51.553 70.1908 54.2687 70.731C56.9845 71.2712 59.7994 70.9939 62.3576 69.9343C64.9157 68.8747 67.1022 67.0803 68.6406 64.778C70.1789 62.4757 71 59.7689 71 57C70.9961 53.2882 69.5198 49.7295 66.8952 47.1048C64.2705 44.4802 60.7118 43.0039 57 43ZM57 45.1538C59.2951 45.1514 61.541 45.8195 63.4615 47.0762V49.7308L60.4771 53.1958L56.2408 53.7692L56.199 53.7396L53.5512 52.0085C53.3164 51.8431 53.0509 51.7263 52.7704 51.6651C52.4899 51.6038 52.1999 51.5992 51.9176 51.6517C51.6352 51.7041 51.3662 51.8124 51.1264 51.9703C50.8866 52.1283 50.6807 52.3325 50.521 52.5712L47.7021 56.7846C47.4673 57.1357 47.3409 57.5482 47.3387 57.9706L47.3077 62.8477L46.8675 63.1371C45.7793 61.3405 45.1884 59.2868 45.1553 57.1865C45.1222 55.0862 45.6482 53.0149 46.6793 51.1849C47.7104 49.3549 49.2096 47.8319 51.0232 46.7721C52.8367 45.7124 54.8995 45.1538 57 45.1538ZM48.1544 64.871L48.4937 64.6488C48.7899 64.4535 49.0332 64.1879 49.2021 63.8758C49.371 63.5637 49.4601 63.2147 49.4615 62.8598L49.4898 57.9827L52.3114 53.7692C52.3252 53.7799 52.3395 53.7898 52.3544 53.7988L55.0023 55.5313C55.4461 55.8445 55.9921 55.9778 56.5302 55.9042L60.7692 55.3294C61.292 55.2597 61.771 55.0005 62.1154 54.6012L65.0998 51.1335C65.4336 50.7424 65.6164 50.2449 65.6154 49.7308V48.8787C67.072 50.4197 68.0876 52.324 68.5558 54.3922C69.024 56.4604 68.9276 58.6164 68.2767 60.6346L66.104 58.6477C65.802 58.3704 65.4271 58.1852 65.0234 58.1136C64.6197 58.0421 64.2039 58.0873 63.825 58.2438L59.7246 59.9467C59.3818 60.0906 59.0818 60.3204 58.8535 60.614C58.6253 60.9075 58.4765 61.2549 58.4215 61.6227L58.0998 63.8021C58.0225 64.3267 58.1414 64.8614 58.4337 65.3037C58.7261 65.7461 59.1713 66.0651 59.6842 66.1996L62.5731 66.9615L62.8908 67.2806C60.5318 68.6341 57.7785 69.1334 55.0944 68.6945C52.4103 68.2556 49.9595 66.9053 48.1544 64.871ZM64.6731 66.0192L64.0942 65.439C63.8242 65.168 63.4869 64.9738 63.1169 64.8763L60.2308 64.1144L60.5525 61.935L64.6515 60.2308L67.3654 62.7185C66.6737 63.9716 65.7617 65.0898 64.6731 66.0192Z"
							fill="url(#globeGradient)"
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
