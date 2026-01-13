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

const ContactConfirmationDialog = () => {
	const { isDialogOpen, closeDialog } = useDialogContext();
	const dialogContentId = "confirmation-content";
	const router = useRouter();

	const handleRedirect = () => {
		closeDialog(DialogType.PROVIDERS_CONTACT_CONFIRMATION);

		router.push("/");
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.PROVIDERS_CONTACT_CONFIRMATION)}
			onOpenChange={handleRedirect}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="Sparkles" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-xl font-semibold leading-none tracking-tight text-text-100 mb-2">
							Thank you for filling out the form!
						</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-text-300 text-base max-w-[70%] mx-auto text-center"
					>
						You will receive an email shortly with details on how to contact the
						agency. As a token of our appreciation,{" "}
						<span className="text-primary-100 font-medium">
							we reward each review with 5% of the project budget.
						</span>
						<br />
						<br />
						Thank you for choosing our platform!
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full mt-auto">
					<Button
						variant="primary"
						size="md"
						onClick={handleRedirect}
						fullWidth
					>
						Go to Homepage
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default ContactConfirmationDialog;
