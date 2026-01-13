const ProviderCardSkeleton = () => (
	<div className="flex flex-col border-stroke-25 bg-gradient-4 rounded-xl border overflow-hidden animate-pulse">
		<div className="py-8 px-10">
			<div className="flex mb-9">
				<div className="flex gap-4">
					<div className="w-20 h-20 bg-slate-700 rounded-sm" />
					<div className="flex flex-col gap-2">
						<div className="h-6 w-48 bg-slate-700 rounded" />
						<div className="h-5 w-20 bg-slate-700 rounded" />
					</div>
				</div>
				<div className="ml-auto">
					<div className="h-5 w-32 bg-slate-700 rounded" />
				</div>
			</div>
			<div className="flex">
				<div className="flex-1">
					<div className="h-4 w-24 bg-slate-700 rounded mb-2" />
					<div className="h-5 w-96 bg-slate-700 rounded" />
				</div>
				<div className="ml-auto">
					<div className="h-8 w-64 bg-slate-700 rounded" />
				</div>
			</div>
		</div>
		<div className="px-10 py-6 bg-[rgba(3,0,20,0.55)] border-t border-stroke-25 text-right">
			<div className="h-10 w-32 bg-slate-700 rounded ml-auto" />
		</div>
	</div>
);

export default ProviderCardSkeleton;
