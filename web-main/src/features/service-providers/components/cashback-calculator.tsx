import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";

type CashbackCalculatorProps = {
	amount: number;
	percentage?: number;
};

const CashbackCalculator = ({
	amount,
	percentage = 5,
}: CashbackCalculatorProps) => {
	return (
		<div className="flex flex-col md:flex-row gap-10 p-8 bg-primary-200 rounded-lg shadow-[inset_6px_10px_21.2px_0px_#342B6FCF]">
			<div className="flex-1">
				<Heading as="h2" variants="h5" className="mb-4">
					Cashback
				</Heading>
				<Body variants="12-regular" className="text-text-300 mb-2">
					Estimated cashback
				</Body>
				<Body variants="14-regular" className="text-text-100">
					The cashback amount is based on the referral commission we receive
					from our partner service providers. The standard cashback you can
					expect is 5% of the total fee you paid.
				</Body>
			</div>
			<div className="flex-shrink-0 flex items-center">
				<div className="bg-primary-250 px-8 py-6 rounded-lg">
					<Body variants="16-bold" className="text-text-100">
						{`${percentage}% of $${amount} = $${amount * (percentage / 100)}`}
					</Body>
				</div>
			</div>
		</div>
	);
};

export default CashbackCalculator;
