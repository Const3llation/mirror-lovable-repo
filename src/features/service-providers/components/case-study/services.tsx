import { Heading } from "@/components/ui/heading";
import HorizontalServices from "@/features/service-providers/components/profile/horizontal-service";
import ServiceAccordion from "@/features/service-providers/components/profile/service-accordion";
import type { Service } from "@/features/service-providers/components/profile/services";
import VerticalService from "@/features/service-providers/components/profile/vertical-service";

type Props = {
	services: Service[];
};

export default function Services({ services }: Props) {
	return (
		<div
			className="flex flex-col w-full rounded-lg px-4 py-6 md:py-10 md:px-6 lg:p-10"
			style={{
				background: `
                    linear-gradient(0deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0)),
                    linear-gradient(180deg, rgba(255, 255, 255, 0.01) 69.91%, rgba(255, 255, 255, 0.04) 100%),
                    radial-gradient(64.89% 49.13% at 28.32% 25.31%, rgba(95, 82, 177, 0.21) 0%, rgba(95, 82, 177, 0.07) 100%)`,
			}}
		>
			<Heading variants="h4" className="text-text-100 text-center mb-10">
				Services
			</Heading>
			<div className="lg:block hidden">
				{services.length <= 3 ? (
					<div
						className="grid gap-4"
						style={{
							gridTemplateColumns: `repeat(${services.length}, minmax(0, 1fr))`,
						}}
					>
						{services.map((service) => (
							<VerticalService key={service.name} {...service} />
						))}
					</div>
				) : (
					<div className="flex flex-col gap-4">
						{services.map((service) => (
							<HorizontalServices key={service.name} {...service} />
						))}
					</div>
				)}
			</div>
			<div className="lg:hidden flex flex-col gap-4">
				{services.map((service) => (
					<ServiceAccordion
						key={service.name}
						title={service.name}
						icon={service.icon}
						items={service.serviceItems}
					/>
				))}
			</div>
		</div>
	);
}
