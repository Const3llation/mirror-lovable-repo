import { cn } from "@/utils/cn"; // Utility for conditional class names
import { ArrowLeft, ArrowRight } from "lucide-react";
import React from "react";

interface PaginationProps {
	total: number;
	pageCount: number;
	hasNext: boolean;
	hasPrev: boolean;
	page: number;
	limit: number;
	onPageChange?: (page: number) => void;
	className?: string;
}

const Pagination = ({
	total,
	pageCount,
	hasNext,
	hasPrev,
	page,
	limit,
	onPageChange = () => {},
	className,
}: PaginationProps) => {
	// Memoize page numbers to prevent unnecessary recalculations
	const pageNumbers = React.useMemo(() => {
		const numbers: (number | string)[] = [];

		// Case 1: 6 pages or less - show all pages
		if (pageCount <= 6) {
			for (let i = 1; i <= pageCount; i++) {
				numbers.push(i);
			}
			return numbers;
		}

		// Case 2: 7 pages or more - consider current page
		const addEllipsis = (lastPage: number) => {
			if (lastPage < pageCount - 1) {
				numbers.push("...");
			}
		};

		const addPages = (start: number, end: number) => {
			for (let i = start; i <= end; i++) {
				numbers.push(i);
			}
		};

		numbers.push(1); // Always include the first page

		// Add pages around the current page
		if (page > 3) {
			numbers.push("...");
		}

		const start = Math.max(2, page - 1);
		const end = Math.min(pageCount - 1, page + 1);
		addPages(start, end);

		addEllipsis(end);

		numbers.push(pageCount);

		return numbers;
	}, [pageCount, page]);

	// Show total results count
	const startCount = (page - 1) * limit + 1;
	const endCount = Math.min(page * limit, total);

	return (
		<div
			className={cn("inline-flex flex-col items-center", className)}
			aria-label="Pagination"
		>
			{/* Pagination controls */}
			<nav className="flex items-center border border-stroke-25 rounded-lg bg-background-input">
				{/* Previous button */}
				<button
					type="button"
					onClick={() => hasPrev && onPageChange(page - 1)}
					disabled={!hasPrev}
					className="flex items-center py-2 px-5 text-text-100 disabled:opacity-50 disabled:cursor-not-allowed hover:text-text-100 transition-colors whitespace-nowrap"
					aria-label="Previous page"
				>
					<ArrowLeft className="h-4 w-4" />
					<span className="ml-2 font-bold text-sm">Previous</span>
				</button>

				{/* Page numbers */}
				<div className="flex items-center">
					{pageNumbers.map((num, index) => (
						<React.Fragment
							key={`pagination-page-${num}-${
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								index
							}`}
						>
							{typeof num === "number" ? (
								<button
									type="button"
									onClick={() => onPageChange(num)}
									className={cn(
										"p-2 min-w-[40px] text-sm font-bold transition-colors border-l border-r border-stroke-25 text-center",
										page === num
											? "bg-primary-300 text-white"
											: "text-text-100 hover:text-white hover:bg-primary-300",
									)}
									aria-current={page === num ? "page" : undefined}
									aria-label={`Page ${num}`}
								>
									{num}
								</button>
							) : (
								<span
									className="p-2 text-text-100 text-sm font-bold border-l border-r border-stroke-25"
									aria-hidden="true"
								>
									{num}
								</span>
							)}
						</React.Fragment>
					))}
				</div>

				{/* Next button */}
				<button
					type="button"
					onClick={() => hasNext && onPageChange(page + 1)}
					disabled={!hasNext}
					className="flex items-center py-2 px-5 text-text-100 disabled:opacity-50 disabled:cursor-not-allowed hover:text-text-100 transition-colors whitespace-nowrap"
					aria-label="Next page"
				>
					<span className="mr-2 font-bold text-sm">Next</span>
					<ArrowRight className="h-4 w-4" />
				</button>
			</nav>
		</div>
	);
};

export default Pagination;
