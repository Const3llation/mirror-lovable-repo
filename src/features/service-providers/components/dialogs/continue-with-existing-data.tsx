"use client";
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

const ContinueWithExistingData = () => {
	const { isDialogOpen, closeDialog, getDialogData } = useDialogContext();
	const dialogContentId = "continue-with-existing-data-content";

	const handleContinueWithData = async () => {
		const data = getDialogData(DialogType.CONTINUE_WITH_EXISTING_DATA);
		data?.onContinueWithData();
		closeDialog(DialogType.CONTINUE_WITH_EXISTING_DATA);
	};

	const handleOnClose = () => {
		closeDialog(DialogType.CONTINUE_WITH_EXISTING_DATA);
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.CONTINUE_WITH_EXISTING_DATA)}
			onOpenChange={handleOnClose}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="Save" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-lg font-semibold leading-none tracking-tight text-text-100 mb-2">
							Resume your profile setup?
						</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-center text-text-100 max-w-[70%] mx-auto"
					>
						We found your saved progress. Would you like to continue from where
						you left off?
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full mt-auto">
					<Button
						variant="secondary"
						size="md"
						onClick={handleOnClose}
						fullWidth
					>
						Start fresh
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={handleContinueWithData}
						fullWidth
					>
						Resume progress
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ContinueWithExistingData;
