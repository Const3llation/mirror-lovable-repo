"use client";
import { useRouter } from "next/navigation";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/base-dialog";
import { Button } from "@/components/ui/button";
import { DialogHeadingIcon } from "@/components/ui/dialog-heading-icon";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";

const CashbackDialog = () => {
	const router = useRouter();
	const { isDialogOpen, closeDialog } = useDialogContext();
	const dialogContentId = "cashback-info-content";

	const handleRedirectToExplore = () => {
		router.push("/explore");
		closeDialog(DialogType.CASHBACK_INFO);
	};

	const handleClose = () => {
		closeDialog(DialogType.CASHBACK_INFO);
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.CASHBACK_INFO)}
			onOpenChange={handleClose}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="Sparkles" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-lg font-semibold leading-none tracking-tight text-text-100 mb-2">
							Leave a comment and earn money!
						</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-text-300 text-base max-w-[70%] mx-auto text-center"
					>
						As a token of our appreciation, we reward each review with 5% of the
						project budget.
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full mt-auto">
					<Button
						variant="primary"
						size="md"
						onClick={handleRedirectToExplore}
						fullWidth
					>
						Start exploring
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CashbackDialog;
