"use client";

import CircularGlow from "@/components/circular-glow";
import FilesUploadDialog from "@/components/files-upload-dialog";
import { MobileStepper } from "@/features/service-providers/components/forms/form-mobile-stepper";
import { StepNavigation } from "@/features/service-providers/components/forms/form-navigation";
import { FormStepCard } from "@/features/service-providers/components/forms/form-step-card";
import { FormStepper } from "@/features/service-providers/components/forms/form-stepper";
import ReviewConfirmationDialog from "@/features/service-providers/components/forms/review/dialogs/review-confirmation-dialog";
import { FORM_STEPS_CONFIG } from "@/features/service-providers/config/forms/review";
import {
	UploadProvider,
	useUpload,
} from "@/features/service-providers/context/upload-context";
import { useCreateReview } from "@/features/service-providers/hooks/use-create-provider-review";
import { useViewportSize } from "@/features/service-providers/hooks/user-viewport-size";
import { serviceProvidersReviewFormSchema } from "@/features/service-providers/schemas/review";
import { useMultiStepForm } from "@/hooks/use-multistep-form";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { z } from "zod";

const DEFAULT_FORM_VALUES = {
	basicInformation: {
		firstName: "",
		lastName: "",
		email: "",
		telegramUsername: "",
		phoneNumber: "",
	},
	project: {
		description: "",
		budget: undefined,
		timeline: undefined,
		services: [],
		file: undefined,
	},
	review: {
		rating: 0,
		review: "",
	},
	cashback: {
		crypto: undefined,
		walletAddress: "",
		acceptPrivacyPolicy: false,
	},
};

type Props = {
	slug: string;
};

const CreateReviewForm = ({ slug }: Props) => {
	const { isDesktop } = useViewportSize();
	const { openDialog, closeDialog } = useDialogContext();
	const createReviewMutation = useCreateReview();
	const { filesToUpload } = useUpload();

	const methods = useForm<z.infer<typeof serviceProvidersReviewFormSchema>>({
		resolver: zodResolver(serviceProvidersReviewFormSchema),
		defaultValues: DEFAULT_FORM_VALUES,
		mode: "onChange",
		reValidateMode: "onSubmit",
	});

	const orderedSteps = FORM_STEPS_CONFIG.sort((a, b) => a.order - b.order);

	const currentFiles = Array.from(filesToUpload.values());
	const filteredFiles = currentFiles.filter(({ fieldPath }) =>
		fieldPath.startsWith("project.files"),
	);

	const {
		goToNext,
		goToPrevious,
		currentStep,
		currentStepId,
		isFirstStep,
		isLastStep,
		isSubmitting,
	} = useMultiStepForm({
		steps: orderedSteps,
		form: methods,
		initialStep: orderedSteps[0],
		shouldSubmitStep: true,
		onStepSubmit: async (stepId: string, data: unknown) => {
			return true;
		},
		async onFormComplete(data) {
			try {
				// Create the review first
				const response = await createReviewMutation.mutateAsync({
					...data,
					serviceProviderSlug: slug,
				});

				// If review creation is successful, open the upload dialog
				if (response.success) {
					if (filteredFiles.length > 0) {
						openDialog(DialogType.UPLOAD_PROVIDER_FILES, {
							context: {
								type: "provider-review",
								id: response.id,
							},
							handleSuccessUpload: () => {
								closeDialog(DialogType.UPLOAD_PROVIDER_FILES);
								openDialog(DialogType.PROVIDERS_REVIEW_CONFIRMATION);
							},
						});
					} else {
						openDialog(DialogType.PROVIDERS_REVIEW_CONFIRMATION);
					}
				}

				return true;
			} catch (error) {
				console.error("Failed to create review:", error);
				// You might want to show an error message to the user here
				return false;
			}
		},
	});

	// Combine the form's isSubmitting state with the mutation's isLoading state
	const isFormSubmitting = isSubmitting || createReviewMutation.isPending;

	return (
		<div className="relative">
			<CircularGlow className="-z-50 left-1/2 -translate-x-1/2 -translate-y-1/2" />
			<CircularGlow className="-z-50" />
			<CircularGlow className="-z-50 right-1/2 translate-x-full translate-y-full" />
			<div className="container mx-auto flex flex-col items-center">
				<FormProvider {...methods}>
					<div className="mb-32 w-full max-w-[500px]">
						{isDesktop ? (
							<FormStepper steps={orderedSteps} currentStepId={currentStepId} />
						) : (
							<MobileStepper
								steps={orderedSteps}
								currentStepId={currentStepId}
							/>
						)}
					</div>

					<FormStepCard>
						<form
							className="w-full min-h-[600px]"
							onSubmit={(e) => {
								e.preventDefault();
							}}
						>
							<div>{currentStep?.component && <currentStep.component />}</div>
							<StepNavigation
								isFirstStep={isFirstStep}
								isLastStep={isLastStep}
								isSubmitting={isFormSubmitting}
								onNext={goToNext}
								onPrevious={goToPrevious}
								labels={{
									next: "Continue",
								}}
							/>
						</form>
					</FormStepCard>
				</FormProvider>
			</div>
		</div>
	);
};

export default ({ slug }: { slug: string }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						staleTime: 5 * 60 * 1000, // 5 minutes
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<UploadProvider>
				<CreateReviewForm slug={slug} />
				<ReviewConfirmationDialog />
				<FilesUploadDialog />
			</UploadProvider>
		</QueryClientProvider>
	);
};
