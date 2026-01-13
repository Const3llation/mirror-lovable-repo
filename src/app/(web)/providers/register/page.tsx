import StarsAnimation from "@/app/(web)/stars-animation";
import CircularGlow from "@/components/circular-glow";
import CreateServiceProviderForm from "@/features/service-providers/components/forms/registration/create-service-provider-form";
import { Suspense } from "react";

export default function CreateServiceProviderPage() {
	return (
		<Suspense>
			<main className="py-44 md:py-56 relative">
				<StarsAnimation className="-z-50" />
				<div className="container text-text-100 h-full relative">
					<CircularGlow className="-z-50 left-1/2 -translate-x-1/2 -translate-y-1/2" />
					<CircularGlow className="-z-50" />
					<CircularGlow className="-z-50 right-1/2 translate-x-full translate-y-full" />
					<CreateServiceProviderForm />
				</div>
			</main>
		</Suspense>
	);
}
