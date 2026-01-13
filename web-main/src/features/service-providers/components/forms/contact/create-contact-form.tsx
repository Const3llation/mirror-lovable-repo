"use client";

import FilesUploadDialog from "@/components/files-upload-dialog";
import ContactConfirmationDialog from "@/features/service-providers/components/forms/contact/dialogs/contact-confirmation-dialog";
import { MobileStepper } from "@/features/service-providers/components/forms/form-mobile-stepper";
import { StepNavigation } from "@/features/service-providers/components/forms/form-navigation";
import { FormStepCard } from "@/features/service-providers/components/forms/form-step-card";
import { FormStepper } from "@/features/service-providers/components/forms/form-stepper";
import { FORM_STEPS_CONFIG } from "@/features/service-providers/config/forms/contact";
import { UploadProvider } from "@/features/service-providers/context/upload-context";
import { useCreateContact } from "@/features/service-providers/hooks/use-create-provider-contact";
import { useViewportSize } from "@/features/service-providers/hooks/user-viewport-size";
import { serviceProvidersContactFormSchema } from "@/features/service-providers/schemas/contact";
import { useMultiStepForm } from "@/hooks/use-multistep-form";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

const DEFAULT_FORM_VALUES = {
	basicInformation: {
		firstName: "",
		lastName: "",
		email: "",
		telegramUsername: "",
	},
	project: {
		description: "",
		budget: null,
		timeline: null,
		services: [],
		additionalDetails: "",
		files: [],
	},
	cashback: {
		crypto: null,
		walletAddress: "",
		acceptPrivacyPolicy: false,
	},
};

const CreateContactForm = ({ slug }: { slug: string }) => {
	const { isDesktop } = useViewportSize();
	const { openDialog, closeDialog } = useDialogContext();
	const createContactMutation = useCreateContact();
	const methods = useForm({
		resolver: zodResolver(serviceProvidersContactFormSchema),
		defaultValues: DEFAULT_FORM_VALUES,
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const orderedSteps = FORM_STEPS_CONFIG.sort((a, b) => a.order - b.order);

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
				const response = await createContactMutation.mutateAsync({
					...data,
					serviceProviderSlug: slug,
				});

				if (response.success) {
					openDialog(DialogType.UPLOAD_PROVIDER_FILES, {
						context: {
							type: "provider-contact",
							id: response.id,
						},
						handleSuccessUpload: async () => {
							closeDialog(DialogType.UPLOAD_PROVIDER_FILES);
							openDialog(DialogType.PROVIDERS_CONTACT_CONFIRMATION);
							await completeContact(response.id);
						},
					});
				}

				return true;
			} catch (error) {
				console.error("Failed to create contact:", error);
				return false;
			}
		},
	});

	// Combine form and mutation loading states
	const isFormSubmitting = isSubmitting || createContactMutation.isPending;

	const completeContact = async (contactId: string) => {
		try {
			const response = await fetch(
				`/api/providers/contact/${contactId}/complete`,
				{
					method: "POST",
				},
			);

			if (!response.ok) {
				throw new Error("Failed to complete contact process");
			}

			return true;
		} catch (error) {
			console.error("Error completing contact:", error);
			return false;
		}
	};

	return (
		<div className="container mx-auto flex flex-col items-center">
			<FormProvider {...methods}>
				<div className="mb-32 w-full max-w-[500px]">
					{isDesktop ? (
						<FormStepper steps={orderedSteps} currentStepId={currentStepId} />
					) : (
						<MobileStepper steps={orderedSteps} currentStepId={currentStepId} />
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
	);
};

export default ({ slug }: { slug: string }) => {
	const [queryClient] = useState(
		() =>
			new QueryClient({
				defaultOptions: {
					queries: {
						retry: 1,
						staleTime: 5 * 60 * 1000,
					},
				},
			}),
	);

	return (
		<QueryClientProvider client={queryClient}>
			<UploadProvider>
				<CreateContactForm slug={slug} />
				<ContactConfirmationDialog />
				<FilesUploadDialog />
			</UploadProvider>
		</QueryClientProvider>
	);
};
