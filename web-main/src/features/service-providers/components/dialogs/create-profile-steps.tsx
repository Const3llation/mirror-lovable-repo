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

export interface RegistrationStep {
	id: number;
	text: string;
}

export const REGISTRATION_STEPS: readonly RegistrationStep[] = [
	{
		id: 1,
		text: "Fill out the form",
	},
	{
		id: 2,
		text: "Our team will review the form, prepare and send document for signing",
	},
	{
		id: 3,
		text: "After signing all documents, you'll pay a one-time processing fee and a quarterly membership subscription",
	},
	{
		id: 4,
		text: "After signing all documents, you'll pay a one-time processing fee and a quarterly membership subscription",
	},
] as const;

interface RegistrationDialogData {
	onCancel: () => void;
	onContinue: () => void;
}

const CreateServiceProviderProfileStepsDialog = () => {
	const { isDialogOpen, closeDialog, getDialogData } = useDialogContext();
	const dialogContentId = "create-provider-steps-content";

	const handleCancel = () => {
		const data = getDialogData<RegistrationDialogData>(
			DialogType.CREATE_PROVIDER_STEPS,
		);
		closeDialog(DialogType.CREATE_PROVIDER_STEPS);
		data?.onCancel?.();
	};

	const handleContinue = () => {
		const data = getDialogData<RegistrationDialogData>(
			DialogType.CREATE_PROVIDER_STEPS,
		);
		closeDialog(DialogType.CREATE_PROVIDER_STEPS);
		data?.onContinue?.();
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.CREATE_PROVIDER_STEPS)}
			onOpenChange={(open) => {
				// When the dialog is dismissed (e.g. via the overlay or close button),
				// treat it as a cancellation.
				if (!open) {
					handleCancel();
				}
			}}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="CircleUserPlus" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-lg font-semibold leading-none tracking-tight text-text-100 mb-2">
							Create a profile
						</div>
						<div className="text-base font-medium text-text-300">Steps</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-center max-w-[70%] mx-auto"
					>
						<ul className="flex flex-col gap-6 mb-6">
							{REGISTRATION_STEPS.map((step, index) => (
								<li
									key={step.id}
									className="flex items-start gap-3 text-text-100"
								>
									<span className="flex-shrink-0 w-10 h-10 bg-gradient-4 border border-stroke-25 rounded-full flex items-center justify-center text-base font-medium">
										{index + 1}
									</span>
									<span className="flex-grow text-left text-base font-medium">
										{step.text}
									</span>
								</li>
							))}
						</ul>
						<p className="text-text-200 text-base">
							It will take you around{" "}
							<span className="text-primary-100 font-medium">
								15-30 minutes
							</span>{" "}
							to complete this form.
						</p>
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full mt-auto">
					<Button
						variant="secondary"
						size="md"
						onClick={handleCancel}
						fullWidth
					>
						Cancel
					</Button>
					<Button
						variant="primary"
						size="md"
						onClick={handleContinue}
						fullWidth
					>
						Continue
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default CreateServiceProviderProfileStepsDialog;
