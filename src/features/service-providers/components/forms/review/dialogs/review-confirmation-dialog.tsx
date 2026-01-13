"use client";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/base-dialog";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { DialogHeadingIcon } from "@/components/ui/dialog-heading-icon";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import { useRouter } from "next/navigation";

const ReviewConfirmationDialog = () => {
	const { isDialogOpen, closeDialog } = useDialogContext();
	const dialogContentId = "review-confirmation-content";
	const router = useRouter();

	const handleRedirect = () => {
		closeDialog(DialogType.PROVIDERS_REVIEW_CONFIRMATION);

		router.push("/");
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.PROVIDERS_REVIEW_CONFIRMATION)}
			onOpenChange={handleRedirect}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="Sparkles" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<div className="text-xl font-semibold leading-none tracking-tight text-text-100 mb-2">
							Thank you for submitting your review!
						</div>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-text-300 text-base max-w-[70%] mx-auto text-center"
					>
						We are pleased to inform you about our cashback program, where you
						can receive up to{" "}
						<span className="text-primary-100 font-medium">5% cashback</span>
						based on the budget you spend on your project. Here's how it works:
						<br />
						<br />
						<ul className="flex flex-col gap-6 px-8">
							<li className="flex items-start gap-3 text-text-100">
								<span className="flex-shrink-0 w-10 h-10 bg-gradient-4 border border-stroke-25 rounded-full flex items-center justify-center text-base font-medium">
									1
								</span>
								<span className="flex-grow text-left text-base font-medium">
									<Body variants="16-medium" className="text-text-300">
										<span className="text-text-100">Enter your budget:</span>{" "}
										Start by entering the budget for your project on our
										platform.
									</Body>
								</span>
							</li>
							<li className="flex items-start gap-3 text-text-100">
								<span className="flex-shrink-0 w-10 h-10 bg-gradient-4 border border-stroke-25 rounded-full flex items-center justify-center text-base font-medium">
									2
								</span>
								<span className="flex-grow text-left text-base font-medium">
									<Body variants="16-medium" className="text-text-300">
										<span className="text-text-100">Progress Indicator:</span>{" "}
										As you enter your budget, a progress indicator will show you
										the potential cashback amount. For example, "You could
										receive $250 cashback based on your budget."
									</Body>
								</span>
							</li>
							<li className="flex items-start gap-3 text-text-100">
								<span className="flex-shrink-0 w-10 h-10 bg-gradient-4 border border-stroke-25 rounded-full flex items-center justify-center text-base font-medium">
									3
								</span>
								<span className="flex-grow text-left text-base font-medium">
									<Body variants="16-medium" className="text-text-300">
										<span className="text-text-100">
											Complete Your Project:
										</span>{" "}
										Proceed with your project as planned.
									</Body>
								</span>
							</li>

							<li className="flex items-start gap-3 text-text-100">
								<span className="flex-shrink-0 w-10 h-10 bg-gradient-4 border border-stroke-25 rounded-full flex items-center justify-center text-base font-medium">
									3
								</span>
								<span className="flex-grow text-left text-base font-medium">
									<Body variants="16-medium" className="text-text-300">
										<span className="text-text-100">Receive Cashback:</span>{" "}
										Once your project is completed and the budget is confirmed,
										you will receive the eligible cashback amount.
									</Body>
								</span>
							</li>
						</ul>
						<br />
						Thank you for choosing our platform. We are committed to helping you
						get the most out of your investment.
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

export default ReviewConfirmationDialog;
