import { Body } from "@/components/ui/body";
import { ButtonLink } from "@/components/ui/button-link";

const PartnersBanner = () => {
	return (
		<div
			className="relative py-6 px-8 md:py-16 border border-[#312868] rounded-2xl overflow-hidden"
			style={{
				background:
					"linear-gradient(180deg, rgba(63, 51, 142, 1) 0%, rgba(18, 13, 43, 1) 100%)",
			}}
		>
			<div
				className="absolute left-1/2 -bottom-[40%] -translate-x-1/2 w-[500px] h-[300px] rounded-full opacity-30"
				style={{
					background: "rgba(140, 69, 255, 1)",
					filter: "blur(70px)",
				}}
			/>

			<div
				className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
				style={{
					backgroundImage: "url('/ripples.webp')",
				}}
			/>

			<div className="relative text-center z-10">
				<h2 className="text-text-100 text-4xl font-semibold mb-4">
					Explore partners now
				</h2>
				<Body
					variants="20-medium"
					className="max-w-[40ch] mx-auto text-text-200 mb-8"
				>
					Find the perfect business solutions to bring your web3 project to
					life.
				</Body>
				<ButtonLink href="/explore" variant="primary" size="lg">
					Explore now
				</ButtonLink>
			</div>
		</div>
	);
};

export default PartnersBanner;
