import { Body } from "@/components/ui/body";
import NameInitials from "@/components/ui/name-initials";
import getUploadDisplayUrl from "@/features/service-providers/utils/get-upload-display-url";
import type { TeamMember as TTeamMember } from "@/types/payload";
import Image from "next/image";

type Props = TTeamMember;

export default function TeamMember({ image, name, position }: Props) {
	return (
		<div className="flex flex-col justify-center align-middle py-3.5 px-5 gap-2 bg-[#1D1A2F] rounded-lg w-full h-full">
			<div className="w-14 h-14 mx-auto">
				{image ? (
					<Image
						src={getUploadDisplayUrl(image)}
						alt={name}
						width={56}
						height={56}
						className="rounded-full"
					/>
				) : (
					<NameInitials name={name} />
				)}
			</div>
			<div className="flex flex-col text-center">
				<Body variants="14-medium" className="text-text-100">
					{name}
				</Body>
				<Body variants="12-regular" className="text-text-300">
					{position}
				</Body>
			</div>
		</div>
	);
}
