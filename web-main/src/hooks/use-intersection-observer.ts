import { useEffect, useRef, useState } from "react";

interface UseIntersectionObserverProps {
	threshold?: number | number[];
	rootMargin?: string;
	delay?: number;
}

export const useIntersectionObserver = ({
	threshold = 0,
	rootMargin = "0px",
	delay = 0,
}: UseIntersectionObserverProps = {}) => {
	const [isIntersecting, setIsIntersecting] = useState(true);
	const targetRef = useRef<HTMLElement | null>(null);
	const timeoutRef = useRef<NodeJS.Timeout>();

	useEffect(() => {
		const observer = new IntersectionObserver(
			([entry]) => {
				if (delay) {
					// Clear any existing timeout
					if (timeoutRef.current) {
						clearTimeout(timeoutRef.current);
					}
					// Set new timeout
					timeoutRef.current = setTimeout(() => {
						setIsIntersecting(entry.isIntersecting);
					}, delay);
				} else {
					setIsIntersecting(entry.isIntersecting);
				}
			},
			{
				threshold,
				rootMargin,
			},
		);

		const currentTarget = targetRef.current;
		if (currentTarget) {
			observer.observe(currentTarget);
		}

		return () => {
			if (currentTarget) {
				observer.unobserve(currentTarget);
			}
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, [threshold, rootMargin, delay]);

	return { targetRef, isIntersecting };
};
