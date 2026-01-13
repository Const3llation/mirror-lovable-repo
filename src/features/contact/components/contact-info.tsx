import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import Image from "next/image";
import Link from "next/link";

type Props = {
	imageUrl: string;
	title: string;
	description: string;
	email: string;
};

export default function ContactInfo({
	imageUrl,
	title,
	description,
	email,
}: Props) {
	return (
		<div className="flex flex-col gap-4 p-8 pt-0 border border-stroke-300 rounded-xl">
			<div className="max-w-72 mx-auto">
				<Image
					src={imageUrl}
					alt="Chat to sales"
					width={270}
					height={180}
					max-width={270}
				/>
			</div>
			<div className="flex flex-col gap-1">
				<Heading variants="h5" className="text-center">
					{title}
				</Heading>
				<Body variants="16-regular" className="text-text-300 text-center">
					{description}
				</Body>
			</div>
			<Link href={`mailto:${email}`}>
				<Body variants="16-regular" className="text-primary-100 text-center">
					{email}
				</Body>
			</Link>
		</div>
	);
}
