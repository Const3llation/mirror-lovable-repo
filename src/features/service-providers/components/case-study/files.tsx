import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";
import Link from "next/link";

type File = {
	id: string;
	name: string;
	url: string;
};

type Props = {
	files: File[];
};

export default function Files({ files }: Props) {
	return (
		<div className="flex flex-col gap-8">
			{files.map((file) => (
				<div
					key={file.id}
					className="flex-1 flex flex-row gap-5 rounded-xl p-4 border border-stroke-5 bg-gradient-4"
				>
					<div className="flex flex-row justify-between w-full items-center">
						<div className="flex flex-row gap-5 items-center">
							<div className="flex flex-col justify-center items-center border border-stroke-5 p-2 rounded-lg bg-gradient-4">
								<Icon name="Pdf" className="text-text-100 w-6 h-6" />
							</div>
							<Body variants="16-medium" className="text-text-100">
								{file.name}
							</Body>
						</div>
						<Link
							href={file.url}
							className="flex flex-row gap-2 text-text-100 items-center"
						>
							<Body variants="16-regular">Download</Body>
							<Icon name="ArrowDown" className="w-4 h-4" />
						</Link>
					</div>
				</div>
			))}
		</div>
	);
}
