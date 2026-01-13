"use client";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";

const CashbackInfoBanner = () => {
	const { openDialog } = useDialogContext();

	return (
		<div
			data-cashback-banner
			className="text-text-100 bg-primary-100 py-2 px-4 text-center"
		>
			<Body variants={"14-medium"} as="span">
				Any services booked through Const3llation are eligible for a 5% cashback
				on the budget for the service. &nbsp;
			</Body>
			<Button
				variant={"link"}
				size={"inline"}
				className="text-text-100 underline"
				onClick={() => openDialog(DialogType.CASHBACK_INFO)}
			>
				Learn more here
			</Button>
		</div>
	);
};

export default CashbackInfoBanner;
