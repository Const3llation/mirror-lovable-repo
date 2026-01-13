// @ts-nocheck

"use client";

import ServiceListCard from "@/components/service-list-card";
import ServiceListCardMobile from "@/components/service-list-card-mobile";
import { Heading } from "@/components/ui/heading";
import { useGridLines } from "@/hooks/use-grid-lines";
import { useServiceList } from "@/hooks/use-services-list";
import { createArray } from "@/utils/create-array";
import { useRef, useState } from "react";

const ServiceListCardSkeleton = () => {
	return (
		<div className="p-5 flex flex-col gap-5 h-[300px] animate-pulse">
			<div className="w-12 h-12 bg-background-200 rounded shrink-0" />
			<div className="flex flex-col gap-5 h-full">
				<div className="h-6 bg-background-200 rounded w-3/4 shrink-0" />
				<ul className="flex flex-col gap-2 flex-1">
					{createArray(3).map((number) => (
						<li key={`service-list-card-skeleton-${number}`}>
							<div className="h-6 bg-background-200 rounded w-2/3" />
						</li>
					))}
				</ul>
			</div>
		</div>
	);
};

const CategoriesExplore = () => {
	const { services, isLoading } = useServiceList({
		depth: 2,
		sortByChildCount: true,
	});
	const [expandedId, setExpandedId] = useState<number | null>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const gridLines = useGridLines({
		containerRef,
		numColumns: 4,
		isLoading,
		dependencies: [services],
	});

	return (
		<>
			<Heading as="h2" className="relative">
				Verified service providers
			</Heading>

			<div className="relative mt-12 sm:mt-16 md:mt-[4.5rem]">
				<div ref={containerRef} className="hidden xl:grid grid-cols-4">
					{isLoading
						? createArray(8).map((number) => (
								<div key={`skeleton-${number}`}>
									<ServiceListCardSkeleton />
								</div>
							))
						: services?.map((service) => (
								<ServiceListCard key={service.id} service={service} />
							))}
				</div>

				<div className="block xl:hidden space-y-4">
					{services?.map((service) => (
						<div key={service.id}>
							<ServiceListCardMobile
								service={service}
								isExpanded={expandedId === service.id}
								onToggle={() =>
									setExpandedId(expandedId === service.id ? null : service.id)
								}
							/>
						</div>
					))}
				</div>

				{/* Border overlay */}
				{!isLoading && (
					<div className="hidden lg:block absolute inset-0 pointer-events-none">
						{/* Vertical borders */}
						<div className="absolute top-0 left-0 h-full w-px border-l border-white/5" />
						<div className="absolute top-0 right-0 h-full w-px border-r border-white/5" />

						{/* Inner vertical borders */}
						{gridLines.vertical.map((position) => (
							<div
								key={`v-border-${position}`}
								className="absolute top-0 w-px h-full bg-gradient-to-b from-transparent via-[rgba(255,255,255,0.12)] to-transparent"
								style={{
									left: `${position}px`,
								}}
							/>
						))}

						{/* Horizontal borders */}
						{gridLines.horizontal.map((position) => (
							<div
								key={`h-border-${position}`}
								className="absolute left-0 w-full h-px bg-gradient-to-r from-transparent via-[rgba(255,255,255,0.12)] to-transparent"
								style={{
									top: `${position}px`,
								}}
							/>
						))}
					</div>
				)}
			</div>
		</>
	);
};

export default CategoriesExplore;
