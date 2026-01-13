import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

type Props = {
	slug: string;
	title: string;
	clientName: string;
	websiteUrl: string;
	projectSchedule: string;
	projectSize: string;
};

export default function CaseStudyHeader({
	slug,
	title,
	clientName,
	websiteUrl,
	projectSchedule,
	projectSize,
}: Props) {
	return (
		<div className="flex flex-col w-full">
			<div className="w-full border-b border-stroke-25 py-10">
				<Link
					href={`/providers/${slug}`}
					className="flex flex-row gap-2 items-center"
				>
					<Icon name="ArrowLeft" className="text-text-200 w-4 h-4" />
					<Body variants="16-regular" className="text-text-200">
						Go to back
					</Body>
				</Link>
			</div>
			<div className="mt-10 flex flex-col gap-8">
				<div className="flex flex-col gap-3">
					<div className="flex flex-col gap-3 md:flex-row md:justify-between md:items-center">
						<Heading variants="h4" className="text-text-200">
							{title}
						</Heading>
						<Link href={websiteUrl}>
							<Body variants="16-regular" className="text-primary-100">
								Website
							</Body>
						</Link>
					</div>
					<Body variants="16-regular" className="text-text-300">
						{clientName}
					</Body>
				</div>
				<div className="flex flex-col md:flex-row gap-8">
					<div className="flex-1 flex flex-row gap-5 rounded-xl p-4 border border-stroke-5 bg-gradient-4">
						<div className="flex flex-col justify-center items-center border border-stroke-5 p-2 rounded-lg bg-gradient-4">
							<Icon name="CalendarDays" className="text-text-100 w-6 h-6" />
						</div>
						<div className="flex flex-col gap-1">
							<Body variants="12-regular" className="text-text-300">
								Project duration
							</Body>
							<Body variants="14-medium" className="text-text-100">
								{projectSchedule}
							</Body>
						</div>
					</div>
					<div className="flex-1 flex flex-row gap-5 rounded-xl p-4 border border-stroke-5 bg-gradient-4">
						<div className="flex flex-col justify-center items-center border border-stroke-5 p-2 rounded-lg bg-gradient-4">
							<Icon name="EarnMoney" className="text-text-100 w-6 h-6" />
						</div>
						<div className="flex flex-col gap-1">
							<Body variants="12-regular" className="text-text-300">
								Project Size
							</Body>
							<Body variants="14-medium" className="text-text-100">
								{projectSize}
							</Body>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
