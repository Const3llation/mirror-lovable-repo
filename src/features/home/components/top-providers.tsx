"use client";

import CircularGlow from "@/components/circular-glow";
import { Chip } from "@/components/ui/chip";
import { Heading } from "@/components/ui/heading";
import {
	CategoriesCarousel,
	CategoriesCarouselItem,
} from "@/features/home/components/categories-carousel-wrapper";
import {
	ProvidersCarousel,
	ProvidersCarouselItem,
} from "@/features/home/components/providers-carousel-wrapper";
import { ServiceProviderCard } from "@/features/home/components/service-provider-card";
import { useProvidersList } from "@/hooks/use-providers-list";
import { useServiceList } from "@/hooks/use-services-list";
import { cn } from "@/utils/cn";
import { createArray } from "@/utils/create-array";
import { useState } from "react";

type TopProvidersProps = {
	className?: string;
};

const ChipSkeleton = () => {
	return (
		<div
			className="h-8 w-24 rounded-full bg-background-200 animate-pulse"
			aria-hidden="true"
		/>
	);
};

export const ServiceProviderCardSkeleton = () => {
	return (
		<div className="pb-0 h-full flex flex-col bg-gradient-4 border border-stroke-25 rounded-xl animate-pulse">
			{/* Header */}
			<div className="flex items-center gap-4 bg-[rgba(63,50,143,0.2)] rounded-t-xl p-6">
				{/* Logo skeleton */}
				<div className="w-16 h-16 rounded-lg bg-background-200 flex-shrink-0" />
				<div className="flex flex-col items-start gap-2">
					{/* Name skeleton */}
					<div className="h-6 w-32 bg-background-200 rounded" />
					{/* Badge skeleton */}
					<div className="h-5 w-20 bg-background-200 rounded-full" />
				</div>
			</div>

			<div className="p-6 flex-grow border-t border-stroke-25">
				{/* Rating box skeletons */}
				<div className="mb-6">
					<div className="h-12 bg-background-200 rounded-t-lg" />
					<div className="h-12 bg-background-200 rounded-b-lg mt-px" />
				</div>

				{/* Info items skeleton */}
				<div className="flex gap-4 mb-6">
					<div className="flex-1 h-[72px] bg-background-200 rounded-lg" />
					<div className="flex-1 h-[72px] bg-background-200 rounded-lg" />
				</div>

				{/* Categories skeleton */}
				<div className="flex flex-wrap gap-2">
					{createArray(3).map((number) => (
						<div
							key={`service-provider-card-skeleton-${number}`}
							className="h-6 w-20 bg-background-200 rounded-full"
						/>
					))}
				</div>
			</div>

			{/* Button skeleton */}
			<div className="py-6 bg-[rgba(3,0,20,0.5)] border-t border-stroke-25 rounded-b-xl p-6">
				<div className="h-10 bg-background-200 rounded-lg" />
			</div>
		</div>
	);
};

const TopProviders = ({ className }: TopProvidersProps) => {
	const [selectedCategory, setSelectedCategory] = useState<string>("all");

	const { services, isLoading: servicesIsLoading } = useServiceList();
	const {
		providers,
		isLoading: providersAreLoading,
		error: providersError,
	} = useProvidersList({
		category: selectedCategory,
		limit: 10,
	});

	const handleCategorySelect = (category: string) => {
		setSelectedCategory(category);
	};

	return (
		<section
			id="first-section"
			className={cn("container text-center", className)}
		>
			<div className="relative">
				<Heading
					as="h2"
					className="lg:max-w-[25ch] lg:mx-auto relative z-10"
					key="title"
				>
					Top-rated agencies ready to elevate your project
				</Heading>
				<CircularGlow className="hidden lg:block left-1/2 -translate-x-1/2 -translate-y-1/2 z-0" />
			</div>
			<div className="flex flex-col gap-12 mt-14">
				<CategoriesCarousel
					options={{
						align: "start",
						dragFree: true,
					}}
				>
					<CategoriesCarouselItem className="mr-2">
						<Chip
							selected={selectedCategory === "all"}
							onClick={() => handleCategorySelect("all")}
						>
							All
						</Chip>
					</CategoriesCarouselItem>
					{servicesIsLoading ? (
						<>
							{createArray(20).map((number) => (
								<CategoriesCarouselItem
									key={`skeleton-${number}`}
									className="mr-2"
								>
									<ChipSkeleton />
								</CategoriesCarouselItem>
							))}
						</>
					) : (
						services?.map((category) => (
							<CategoriesCarouselItem key={category.id} className="mr-2">
								<Chip
									selected={selectedCategory === category.slug}
									onClick={() => handleCategorySelect(category.slug)}
								>
									{category.name}
								</Chip>
							</CategoriesCarouselItem>
						))
					)}
				</CategoriesCarousel>
				<div className="min-h-[200px]">
					{providersAreLoading ? (
						<ProvidersCarousel
							options={{
								align: "start",
								dragFree: true,
								slidesToScroll: 1,
							}}
						>
							{createArray(3).map((number) => (
								<ProvidersCarouselItem
									key={`skeleton-${number}`}
									className="w-full md:w-1/2 lg:w-1/3 pl-4 first:pl-0"
								>
									<ServiceProviderCardSkeleton />
								</ProvidersCarouselItem>
							))}
						</ProvidersCarousel>
					) : providersError ? (
						<div className="relative text-status-red-100">
							Failed to load providers. Please try again.
						</div>
					) : providers?.length === 0 ? (
						<div className="relative text-text-300">
							No providers found for this category.
						</div>
					) : (
						<ProvidersCarousel
							options={{
								align: "start",
								dragFree: true,
								slidesToScroll: 1,
								slidesToShow: 2,
							}}
						>
							{providers?.map((provider) => (
								<ProvidersCarouselItem
									key={provider.id}
									className="w-full sm:w-1/2 lg:w-1/3 pr-4 last:pr-0"
								>
									<ServiceProviderCard provider={provider} />
								</ProvidersCarouselItem>
							))}
						</ProvidersCarousel>
					)}
				</div>
			</div>
		</section>
	);
};

export default TopProviders;
