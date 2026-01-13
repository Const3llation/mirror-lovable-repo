"use client";

import { useParams, useRouter } from "next/navigation";
import type { z } from "zod";

import StarsAnimation from "@/app/(web)/stars-animation";
import CircularGlow from "@/components/circular-glow";
import { Heading } from "@/components/ui/heading";
import CreateVerifyForm from "@/features/service-providers/components/forms/verify/create-verify-form";
import { useSendVerifyProvider } from "@/features/service-providers/hooks/use-send-verify-provider";
import type { verifyProviderSchema } from "@/features/service-providers/schemas/verify";

const VerifyProviderPage = () => {
	const router = useRouter();
	const params = useParams();
	const { mutate: verifyProvider, isPending } = useSendVerifyProvider();

	const handleSubmit = (data: z.infer<typeof verifyProviderSchema>) => {
		verifyProvider(
			{ ...data, slug: params.slug as string },
			{
				onSuccess: () => {
					router.push(`/providers/${params.slug}`);
				},
				onError: (error) => {
					console.error("Failed to verify provider:", error);
				},
			},
		);
	};

	const handleCancel = () => {
		router.push(`/providers/${params.slug}`);
	};

	return (
		<main className="pt-20 pb-20 md:pt-32 md:pb-32 lg:pt-56 lg:pb-56 relative">
			<StarsAnimation className="-z-50" />
			<div className="container text-text-100 h-full relative">
				<CircularGlow className="-z-50 left-1/2 -translate-x-1/2 -translate-y-1/2" />
				<CircularGlow className="-z-50" />
				<CircularGlow className="-z-50 right-1/2 translate-x-full translate-y-full" />
				<div className="max-w-[860px] mx-auto bg-background-base border border-stroke-50 mt-20 py-6 md:py-12 px-10 rounded-xl flex flex-col">
					<div className="w-[207px] h-[149px] bg-[url('/dialog-heading-icon.webp')] bg-cover bg-no-repeat bg-center mx-auto" />
					<Heading as="h3" variants="h3" className="text-center mb-14">
						Claim Ownership
					</Heading>
					<CreateVerifyForm
						onSubmit={handleSubmit}
						onCancel={handleCancel}
						isPending={isPending}
					/>
				</div>
			</div>
		</main>
	);
};

export default VerifyProviderPage;
