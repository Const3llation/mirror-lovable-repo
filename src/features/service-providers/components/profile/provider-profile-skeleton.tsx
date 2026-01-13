import { cn } from "@/utils/cn";
import { createArray } from "@/utils/create-array";

type Props = {
	className?: string;
};

export default function ProviderProfileSkeleton({ className }: Props) {
	return (
		<div className={cn("flex flex-col container gap-11", className)}>
			{/* Preview Banner Skeleton */}
			<div className="w-full bg-[rgba(3,0,20,0.55)] p-4 rounded-xl border border-stroke-25 animate-pulse">
				<div className="h-12 bg-slate-700 rounded-md w-3/4" />
			</div>

			{/* Highlights Section Skeleton */}
			<div className="w-full bg-gradient-4 rounded-xl border border-stroke-25 p-6">
				<div className="flex flex-col gap-6">
					<div className="h-8 bg-slate-700 rounded-md w-1/3 animate-pulse" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{createArray(6).map((idx) => (
							<div key={idx} className="flex flex-col gap-3 animate-pulse">
								<div className="h-6 bg-slate-700 rounded-md w-1/2" />
								<div className="h-4 bg-slate-700/70 rounded-md w-3/4" />
							</div>
						))}
					</div>
				</div>
			</div>

			{/* Portfolio Section Skeleton */}
			<div className="w-full bg-gradient-4 rounded-xl border border-stroke-25 p-6">
				<div className="flex flex-col gap-6">
					<div className="h-8 bg-slate-700 rounded-md w-1/4 animate-pulse" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{createArray(3).map((i) => (
							<div
								key={i}
								className="aspect-video bg-slate-700 rounded-lg animate-pulse"
							/>
						))}
					</div>
				</div>
			</div>

			{/* Services Section Skeleton */}
			<div className="w-full bg-gradient-4 rounded-xl border border-stroke-25 p-6">
				<div className="flex flex-col gap-6">
					<div className="h-8 bg-slate-700 rounded-md w-1/4 animate-pulse" />
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{createArray(6).map((i) => (
							<div key={i} className="flex items-center gap-3 animate-pulse">
								<div className="h-10 w-10 bg-slate-700 rounded-full" />
								<div className="flex-1">
									<div className="h-5 bg-slate-700 rounded-md w-3/4" />
									<div className="mt-2 h-4 bg-slate-700/70 rounded-md w-1/2" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
