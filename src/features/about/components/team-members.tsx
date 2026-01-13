import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import payload from "@/lib/payload";
import type { ImageUpload } from "@/types/payload";
import Image from "next/image";

export default async function TeamMembers() {
	const teamMembers = await payload.find({
		collection: "team-members",
		limit: 1000,
		depth: 1,
	});

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto relative w-full">
			{teamMembers.docs.map((member) => {
				return (
					<div
						key={`member-${member.id}`}
						className="flex flex-col items-center w-full rounded-lg border border-stroke-25 mx-auto"
					>
						{member.image ? (
							<Image
								src={(member.image as ImageUpload)?.url ?? ""}
								alt={member.name}
								width={270}
								height={160}
								className="rounded-t-lg max-w-[270px] max-h-[160px] object-contain"
							/>
						) : (
							<div className="w-full h-[160px] bg-primary-300 rounded-t-lg" />
						)}
						<div
							className="flex flex-col gap-2 pb-6 pt-4 w-full"
							style={{
								backgroundImage: `
								linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
								radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)
							`,
							}}
						>
							<Heading as="h6" className="text-center">
								{member.name}
							</Heading>
							<Body
								variants="14-regular"
								className="text-center text-primary-150"
							>
								{member.position}
							</Body>
						</div>
					</div>
				);
			})}
		</div>
	);
}
