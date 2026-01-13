import { Body } from "@/components/ui/body";
import Link from "next/link";

type Props = {
	slug: string;
};

export default function CashbackCta({ slug }: Props) {
	return (
		<div className="flex flex-col justify-center min-w-48">
			<div className="w-3/4 md:w-fit px-4 box-border pt-3 pb-2 rounded-t-lg bg-stroke-300 border border-stroke-25 border-b-0 mx-auto">
				<Body
					variants="14-bold"
					className="text-text-200 text-center text-nowrap"
				>
					Get 5% Cashback
				</Body>
			</div>
			<Link
				href={`/providers/${slug}/contact`}
				className="py-2.5 px-5 bg-primary-200 border border-stroke-25 rounded-lg"
			>
				<Body variants="14-medium" className="text-white text-center">
					Contact for inquiries
				</Body>
			</Link>
		</div>
	);
}
