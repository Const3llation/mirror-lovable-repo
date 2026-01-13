import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";

export default function Findings() {
	return (
		<div className="p-4 sm:px-4 sm:py-8 lg:py-6 lg:px-10 rounded-xl bg-primary-200 flex flex-col gap-4">
			<div className="flex flex-row items-center sm:flex-col gap-4 w-52 sm:w-full mx-auto">
				<div className="w-20 h-20 bg-[url('/dialogs/dialog-grid-bg.webp')] bg-cover bg-no-repeat bg-center flex items-center align-middle justify-center self-center">
					<div className="w-10 h-10 bg-gradient-3 rounded-lg mx-auto flex items-center justify-center shadow-icon">
						<div className="w-6 h-6">
							<Icon
								name="Sparkles"
								width={24}
								height={24}
								className="text-text-100"
							/>
						</div>
					</div>
				</div>
				<Heading
					variants="h5"
					className="text-text-100 text-left sm:text-center"
				>
					CONST3LLATION Findings
				</Heading>
			</div>
			<Body variants="14-regular" className="text-text-100 text-center">
				Lorem Ipsum is simply dummy text of the printing and typesetting
				industry.
			</Body>
		</div>
	);
}
