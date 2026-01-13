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

const ProfileCreatedDialog = () => {
	const { isDialogOpen, closeDialog } = useDialogContext();
	const dialogContentId = "profile-created-content";
	const router = useRouter();

	const handleRedirect = () => {
		closeDialog(DialogType.PROFILE_CREATED);

		router.push("/");
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.PROFILE_CREATED)}
			onOpenChange={handleRedirect}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="Sparkles" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-lg font-semibold leading-none tracking-tight text-text-100 mb-2">
							Thank you for creating your profile!
						</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-text-300 text-base max-w-[70%] mx-auto text-center"
					>
						We appreciate your effort in setting up your profile. The next step
						is to verify your information, and we will send you a confirmation
						once everything is checked and approved. After that, we will proceed
						with signing the agreement.
						<span className="font-semibold text-text-100 block my-4">
							Once the payment is made, you will be able to view your profile.
						</span>
						Thank you for your patience and cooperation.
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

export default ProfileCreatedDialog;
