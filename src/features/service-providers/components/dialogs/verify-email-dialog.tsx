"use client";
import { useEffect, useState } from "react";

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
import { CodeInput } from "@/features/service-providers/components/code-input";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import { useVerifyEmail } from "../../hooks/use-verify-email";

const VerifyEmailDialog = () => {
	const { isDialogOpen, closeDialog, getDialogData } = useDialogContext();
	const dialogContentId = "verify-email-content";
	const [code, setCode] = useState("");
	const [errorMessage, setErrorMessage] = useState<string | null>(null);

	const dialogData = getDialogData(DialogType.VERIFY_EMAIL) as {
		email?: string;
		handleFormCompletion?: () => void;
	};

	const { requestVerification, verifyCode, resendCode } = useVerifyEmail();

	useEffect(() => {
		if (isDialogOpen(DialogType.VERIFY_EMAIL) && dialogData?.email) {
			requestVerification.mutate({
				email: dialogData.email,
				onError: (error) => {
					setErrorMessage(error.error);
				},
			});
		}
	}, [isDialogOpen, dialogData?.email, requestVerification.mutate]);

	const handleRedirect = () => {
		dialogData?.handleFormCompletion?.();
		closeDialog(DialogType.VERIFY_EMAIL);
		setCode("");
		setErrorMessage(null);
	};

	const handleConfirm = () => {
		if (!code) {
			setErrorMessage("Please enter the verification code");
			return;
		}

		setErrorMessage(null);

		verifyCode.mutate({
			email: dialogData?.email ?? "",
			code,
			onSuccess: () => {
				setErrorMessage(null);
				handleRedirect();
			},
			onError: (error) => {
				setErrorMessage(error.error || "Failed to verify email");
			},
		});
	};

	const handleCancel = () => {
		setCode("");
		setErrorMessage(null);
		closeDialog(DialogType.VERIFY_EMAIL);
	};

	const handleResend = () => {
		resendCode.mutate({
			email: dialogData?.email ?? "",
			onSuccess: () => {
				setErrorMessage(null);
			},
			onError: (error) => {
				setErrorMessage(error.error || "Failed to resend verification code");
			},
		});
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.VERIFY_EMAIL)}
			onOpenChange={handleCancel}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="MailIcon" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-lg font-semibold leading-none tracking-tight text-text-100 mb-2">
							Verify your email
						</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-text-300 text-base max-w-[70%] mx-auto text-center"
					>
						Please enter the code sent to{" "}
						<span className="text-text-100">
							{dialogData?.email?.replace(/(?<=^.)[^@]+(?=@)/g, (match) =>
								"*".repeat(match.length),
							)}
						</span>
						<div className="space-y-2 mt-10">
							<CodeInput value={code} onChange={setCode} />
							{errorMessage && (
								<p className="text-red-500 text-sm text-center" role="alert">
									{errorMessage}
								</p>
							)}
							<Button
								variant="link"
								onClick={handleResend}
								disabled={resendCode.isPending}
								className="text-sm text-primary-600 hover:text-primary-700 block mx-auto"
							>
								{resendCode.isPending ? "Sending..." : "Resend code"}
							</Button>
						</div>
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
						onClick={handleConfirm}
						disabled={verifyCode.isPending || !code}
						fullWidth
					>
						{verifyCode.isPending ? "Verifying..." : "Confirm"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default VerifyEmailDialog;
