import { useCallback, useEffect, useRef } from "react";

function useDebounceFn(fn: () => void, delay: number) {
	const timeoutRef = useRef<NodeJS.Timeout | null>(null);

	const debouncedFn = useCallback(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			fn();
		}, delay);
	}, [fn, delay]);

	useEffect(() => {
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
		};
	}, []);

	return debouncedFn;
}

export default useDebounceFn;
