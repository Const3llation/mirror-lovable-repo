"use client";

import { useEffect, useRef } from "react";

interface Star {
	x: number;
	y: number;
	opacity: number;
	radius: number;
	baseOpacity: number;
	blinkSpeed: number;
	blinkOffset: number;
}

// Constellation patterns with strategic positioning
const URSA_MINOR_PATTERN = [
	{ x: 0.35, y: 0.15 }, // Polaris (North Star)
	{ x: 0.33, y: 0.22 }, // Yildun
	{ x: 0.3, y: 0.29 }, // Epsilon UMi
	{ x: 0.25, y: 0.32 }, // Zeta UMi
	{ x: 0.2, y: 0.3 }, // Beta UMi
	{ x: 0.18, y: 0.35 }, // Gamma UMi
	{ x: 0.23, y: 0.37 }, // Eta UMi
];

const CASSIOPEIA_PATTERN = [
	{ x: 0.85, y: 0.15 }, // Segin
	{ x: 0.9, y: 0.2 }, // Ruchbah
	{ x: 0.95, y: 0.15 }, // Gamma Cassiopeiae
	{ x: 0.98, y: 0.2 }, // Schedar
	{ x: 0.93, y: 0.25 }, // Caph
];

const ORION_PATTERN = [
	{ x: 0.15, y: 0.55 }, // Betelgeuse
	{ x: 0.1, y: 0.65 }, // Bellatrix
	{ x: 0.13, y: 0.7 }, // Alnitak
	{ x: 0.15, y: 0.7 }, // Alnilam
	{ x: 0.17, y: 0.7 }, // Mintaka
	{ x: 0.2, y: 0.75 }, // Saiph
	{ x: 0.1, y: 0.75 }, // Rigel
];

const CANIS_MAJOR_PATTERN = [
	{ x: 0.75, y: 0.65 }, // Sirius
	{ x: 0.8, y: 0.6 }, // Mirzam
	{ x: 0.78, y: 0.7 }, // Wezen
	{ x: 0.73, y: 0.72 }, // Aludra
	{ x: 0.7, y: 0.68 }, // Adhara
	{ x: 0.72, y: 0.7 }, // Furud
];

const CENTAURUS_PATTERN = [
	{ x: 0.45, y: 0.85 }, // Alpha Centauri
	{ x: 0.5, y: 0.9 }, // Beta Centauri
	{ x: 0.55, y: 0.95 }, // Gamma Centauri
	{ x: 0.52, y: 0.88 }, // Epsilon Centauri
	{ x: 0.48, y: 0.85 }, // Zeta Centauri
	{ x: 0.45, y: 0.82 }, // Theta Centauri
];

const CARINA_PATTERN = [
	{ x: 0.85, y: 0.85 }, // Canopus
	{ x: 0.88, y: 0.9 }, // Beta Carinae
	{ x: 0.83, y: 0.95 }, // Epsilon Carinae
	{ x: 0.87, y: 0.97 }, // Iota Carinae
	{ x: 0.9, y: 0.93 }, // Theta Carinae
	{ x: 0.92, y: 0.96 }, // Upsilon Carinae
];

// In the useEffect, update the constellation generation:
const allConstellations = [
	URSA_MINOR_PATTERN.map((pos) => ({
		...pos,
		opacity: 0.9,
		radius: 1.5,
		blinkSpeed: 0.0007 + Math.random() * 0.0013,
		blinkOffset: Math.random() * Math.PI * 2,
	})),
	CASSIOPEIA_PATTERN.map((pos) => ({
		...pos,
		opacity: 0.9,
		radius: 1.3,
		blinkSpeed: 0.0007 + Math.random() * 0.0013,
		blinkOffset: Math.random() * Math.PI * 2,
	})),
	ORION_PATTERN.map((pos) => ({
		...pos,
		opacity: 0.9,
		radius: 1.4,
		blinkSpeed: 0.0007 + Math.random() * 0.0013,
		blinkOffset: Math.random() * Math.PI * 2,
	})),
	CANIS_MAJOR_PATTERN.map((pos) => ({
		...pos,
		opacity: 0.9,
		radius: 1.2,
		blinkSpeed: 0.0007 + Math.random() * 0.0013,
		blinkOffset: Math.random() * Math.PI * 2,
	})),
	CENTAURUS_PATTERN.map((pos) => ({
		...pos,
		opacity: 0.9,
		radius: 1.3,
		blinkSpeed: 0.0007 + Math.random() * 0.0013,
		blinkOffset: Math.random() * Math.PI * 2,
	})),
	CARINA_PATTERN.map((pos) => ({
		...pos,
		opacity: 0.9,
		radius: 1.4,
		blinkSpeed: 0.0007 + Math.random() * 0.0013,
		blinkOffset: Math.random() * Math.PI * 2,
	})),
];

export default function SpaceAnimation({ className }: { className: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const lineProgressRef = useRef(0);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size to match viewport
		const updateCanvasSize = () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		};

		updateCanvasSize();

		// Generate distant stars
		const distantStars: Star[] = Array.from({ length: 400 }, () => {
			const x = Math.random();
			const y = Math.random();
			const baseOpacity = 0.1 + Math.random() * 0.4;
			return {
				x,
				y,
				opacity: baseOpacity,
				baseOpacity,
				radius: 0.5 + Math.random(),
				blinkSpeed: 0.0007 + Math.random() * 0.0013,
				blinkOffset: Math.random() * Math.PI * 2,
			};
		});

		// Animation function
		const animate = () => {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillStyle = "#030014";
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			// Update and draw distant stars
			for (const star of distantStars) {
				// Add blinking effect
				star.opacity =
					star.baseOpacity *
					(0.7 +
						Math.sin(performance.now() * star.blinkSpeed + star.blinkOffset) *
							0.3);

				ctx.beginPath();
				ctx.arc(
					star.x * canvas.width,
					star.y * canvas.height,
					star.radius,
					0,
					Math.PI * 2,
				);
				ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
				ctx.fill();
			}
			// Draw all constellations
			for (const constellations of allConstellations) {
				let totalDistance = 0;
				const segmentDistances = [];

				// Calculate distances between stars
				for (let i = 0; i < constellations.length - 1; i++) {
					const star = constellations[i];
					const nextStar = constellations[i + 1];

					const dx = (nextStar.x - star.x) * canvas.width;
					const dy = (nextStar.y - star.y) * canvas.height;
					const distance = Math.sqrt(dx * dx + dy * dy);

					segmentDistances.push(distance);
					totalDistance += distance;
				}

				const cycleDuration = 1000; // Drawing duration in ms
				const fadeDuration = 1000; // Fading duration in ms
				const totalCycleDuration = cycleDuration + fadeDuration;

				const currentTime = lineProgressRef.current % totalCycleDuration;
				const progress = Math.min(currentTime / cycleDuration, 1); // Normalized progress

				const targetDistance = totalDistance * progress;
				let drawnDistance = 0;

				// Adjust opacity for fading effect
				let lineOpacity = progress; // Line becomes more visible as it progresses
				if (currentTime > cycleDuration) {
					lineOpacity = 1 - (currentTime - cycleDuration) / fadeDuration;
				}

				// Draw lines gradually based on the target distance
				for (let i = 0; i < constellations.length - 1; i++) {
					const star = constellations[i];
					const nextStar = constellations[i + 1];

					const x = star.x * canvas.width;
					const y = star.y * canvas.height;
					const nextX = nextStar.x * canvas.width;
					const nextY = nextStar.y * canvas.height;

					const segmentDistance = segmentDistances[i];
					const remainingDistance = targetDistance - drawnDistance;

					ctx.beginPath();
					ctx.moveTo(x, y);

					if (remainingDistance >= segmentDistance) {
						// Draw the full segment
						ctx.lineTo(nextX, nextY);
						drawnDistance += segmentDistance;
					} else if (progress < 1) {
						// Draw partial segment based on remaining distance
						const ratio = remainingDistance / segmentDistance;
						const partialX = x + (nextX - x) * ratio;
						const partialY = y + (nextY - y) * ratio;

						ctx.lineTo(partialX, partialY);
						drawnDistance += remainingDistance;
					} else {
						// Draw full segment after fading out
						ctx.lineTo(nextX, nextY);
						drawnDistance += segmentDistance;
					}
					ctx.strokeStyle = `rgba(255, 255, 255, ${0.5 * lineOpacity})`;
					ctx.lineWidth = 1;
					ctx.stroke();

					if (drawnDistance >= targetDistance && progress < 1) break; // Stop if target distance is reached
				}

				// Draw stars
				for (const star of constellations) {
					ctx.beginPath();
					ctx.arc(
						star.x * canvas.width,
						star.y * canvas.height,
						star.radius,
						0,
						Math.PI * 2,
					);
					ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
					ctx.fill();
				}
			}

			lineProgressRef.current += 4;
			lineProgressRef.current %= 2000;

			requestAnimationFrame(animate);
		};

		animate();

		window.addEventListener("resize", updateCanvasSize);
		return () => {
			window.removeEventListener("resize", updateCanvasSize);
		};
	}, []);

	return <canvas ref={canvasRef} className={className} />;
}
