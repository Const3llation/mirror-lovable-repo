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

export default function SpaceAnimation({ className }: { className?: string }) {
	const canvasRef = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		// Set canvas size to match viewport
		const updateCanvasSize = () => {
			const parent = canvas.parentElement;
			if (parent) {
				canvas.width = parent.clientWidth;
				canvas.height = parent.clientHeight;
			}
		};

		updateCanvasSize();

		// Generate distant stars
		const distantStars: Star[] = Array.from(
			{ length: (canvas.width * canvas.height) / 10000 },
			() => {
				const x = Math.random();
				const y = Math.random();
				const baseOpacity = 0.1 + Math.random() * 0.4;
				return {
					x,
					y,
					opacity: baseOpacity,
					baseOpacity,
					radius: 0.5 + Math.random(),
					blinkSpeed: Math.random() * 0.005,
					blinkOffset: Math.random() * Math.PI * 2,
				};
			},
		);

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

			requestAnimationFrame(animate);
		};

		animate();

		const resizeObserver = new ResizeObserver(updateCanvasSize);
		const parent = canvas.parentElement;
		if (parent) {
			resizeObserver.observe(parent);
		}

		window.addEventListener("resize", updateCanvasSize);
		return () => {
			window.removeEventListener("resize", updateCanvasSize);
			if (parent) {
				resizeObserver.unobserve(parent);
			}
		};
	}, []);

	return <canvas ref={canvasRef} className={className} />;
}
