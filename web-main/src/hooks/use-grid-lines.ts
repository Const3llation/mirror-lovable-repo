import { useEffect, useState } from "react";
import type { RefObject } from "react";

interface GridLines {
	vertical: number[];
	horizontal: number[];
}

interface UseGridLinesProps {
	containerRef: RefObject<HTMLElement>;
	numColumns: number;
	isLoading?: boolean;
	dependencies?: unknown[];
}

export function useGridLines({
	containerRef,
	numColumns,
	isLoading = false,
	dependencies = [],
}: UseGridLinesProps) {
	const [gridLines, setGridLines] = useState<GridLines>({
		vertical: [],
		horizontal: [],
	});

	useEffect(() => {
		if (!containerRef.current || isLoading) return;

		const calculateGridLines = () => {
			const container = containerRef.current;
			if (!container) return;

			const items = Array.from(container.children) as HTMLElement[];
			if (!items.length) return;

			const numRows = Math.ceil(items.length / numColumns);

			// Calculate vertical lines (after each column except the last)
			const vertical: number[] = [];
			for (let col = 1; col < numColumns; col++) {
				const item = items[col - 1];
				if (item) {
					const rect = item.getBoundingClientRect();
					vertical.push(rect.right - container.getBoundingClientRect().left);
				}
			}

			// Calculate horizontal lines (after each row except the last)
			const horizontal: number[] = [];
			for (let row = 1; row < numRows; row++) {
				let maxHeight = 0;
				for (let col = 0; col < numColumns; col++) {
					const item = items[row * numColumns + col - numColumns];
					if (item) {
						const rect = item.getBoundingClientRect();
						maxHeight = Math.max(maxHeight, rect.height);
					}
				}
				const previousTotal = horizontal[row - 2] || 0;
				horizontal.push(previousTotal + maxHeight);
			}

			setGridLines({ vertical, horizontal });
		};

		const resizeObserver = new ResizeObserver(calculateGridLines);
		resizeObserver.observe(containerRef.current);

		calculateGridLines();

		return () => {
			resizeObserver.disconnect();
		};
	}, [containerRef, numColumns, isLoading, ...dependencies]);

	return gridLines;
}
