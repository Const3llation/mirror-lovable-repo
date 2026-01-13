"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";

import ProfileCreatedDialog from "@/features/service-providers/components/dialogs/profile-created-dialog";
import VerifyEmailDialog from "@/features/service-providers/components/dialogs/verify-email-dialog";
import { MobileStepper } from "@/features/service-providers/components/forms/form-mobile-stepper";
import { StepNavigation } from "@/features/service-providers/components/forms/form-navigation";
import {
	FormStepLayout,
	PreviewStepLayout,
} from "@/features/service-providers/components/forms/form-step-layout";
import { FormStepper } from "@/features/service-providers/components/forms/form-stepper";
import { FORM_STEPS_CONFIG } from "@/features/service-providers/config/forms/registration";
import { FORM_STEPS } from "@/features/service-providers/config/forms/registration";
import { UploadProvider } from "@/features/service-providers/context/upload-context";
import { useCompleteRegistration } from "@/features/service-providers/hooks/use-complete-registration";
import { useExistingProviderDialog } from "@/features/service-providers/hooks/use-existing-provider-dialog";
import useRegistrationStepsDialog from "@/features/service-providers/hooks/use-registration-steps-dialog";
import { useViewportSize } from "@/features/service-providers/hooks/user-viewport-size";
import { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";
import { submitStepData } from "@/features/service-providers/services/registration";
import { useMultiStepForm } from "@/hooks/use-multistep-form";
import { usePersistedFormState } from "@/hooks/use-persisted-form-state";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import type { ServiceProvider } from "@/types/payload";
import { cn } from "@/utils/cn";
import dynamic from "next/dynamic";

const FilesUploadDialog = dynamic(
	() => import("@/components/files-upload-dialog"),
	{ ssr: false },
);

interface FormData {
	basicInformation: {
		providerName?: string;
		email?: string;
		foundedYear?: number;
	};
	branding: Record<string, unknown>;
	services: { categories: string[]; subCategories: string[] };
	portfolio: {
		minimumBudget: {
			id: string;
			label: string;
			value: string;
		} | null;
		caseStudies: Partial<ServiceProvider["caseStudies"]>;
	};
	socialMedia: Record<string, unknown>;
	team: Record<string, unknown>;
}

const DEFAULT_FORM_VALUES: FormData = {
	basicInformation: {},
	branding: {
		logo: "",
		shortDescription: "",
		longDescription: "",
	},
	services: { categories: [], subCategories: [] },
	portfolio: {
		minimumBudget: null,
		caseStudies: [],
	},
	socialMedia: {},
	team: {},
};

const CreateServiceProviderFormContent = () => {
	const [serviceProviderId, setServiceProviderId] = useState<
		string | undefined
	>();

	const methods = useForm<FormData>({
		resolver: zodResolver(serviceProviderFormSchema),
		defaultValues: DEFAULT_FORM_VALUES,
		mode: "onTouched",
		reValidateMode: "onBlur",
	});

	const { openDialog, closeDialog } = useDialogContext();

	const email = methods.watch("basicInformation.email");

	const { clearPersistedState: clearPersistedFormStorage } =
		usePersistedFormState(methods);
	const {
		clearPersistedState: clearExistingProviderStorage,
		isSearching: isSearchingEmail,
	} = useExistingProviderDialog(email, methods.reset);
	useRegistrationStepsDialog();
	const { mutate: completeRegistration } = useCompleteRegistration();

	const handleStepComplete = useCallback(
		(stepId: string) => {
			if (stepId === FORM_STEPS.BASIC_INFO && serviceProviderId) {
				setServiceProviderId(serviceProviderId);
			}
		},
		[serviceProviderId],
	);

	const handleFormCompletion = useCallback(() => {
		openDialog(DialogType.UPLOAD_PROVIDER_FILES, {
			context: {
				type: "service-provider",
				id: serviceProviderId,
			},
			handleSuccessUpload: () => {
				closeDialog(DialogType.UPLOAD_PROVIDER_FILES);
				openDialog(DialogType.PROFILE_CREATED);
			},
		});

		clearPersistedFormStorage();
		clearExistingProviderStorage();

		completeRegistration(
			{ providerId: serviceProviderId },
			{
				onSuccess: () => {},
				onError: (error) => {
					console.error("Failed to complete registration:", error);
					// You might want to show an error toast/message here
				},
			},
		);
	}, [
		openDialog,
		closeDialog,
		clearPersistedFormStorage,
		clearExistingProviderStorage,
		serviceProviderId,
		completeRegistration,
	]);

	const { isDesktop } = useViewportSize();

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
			// We don't need to submit the review step
			if (stepId === FORM_STEPS.REVIEW) {
				return true;
			}

			try {
				const response = await submitStepData({
					stepId,
					data: data as Record<string, unknown>,
					serviceProviderId,
					isLastStep,
				});

				if (response.serviceProviderId) {
					setServiceProviderId(response.serviceProviderId);
				}

				return response.isValid;
			} catch (error) {
				console.error("Failed to submit step:", error);
				return false;
			}
		},
		onStepComplete: handleStepComplete,
		// We moved final submission to the files upload dialog
		// onFormComplete: handleFormCompletion,
	});

	const handleNext = useCallback(async () => {
		// Get all field errors after validation
		const success = await goToNext();

		if (!success) {
			// Find the first error element
			const firstErrorElement = document.querySelector(
				'[aria-invalid="true"], .formFieldError',
			);

			if (firstErrorElement) {
				// Scroll the element into view with some offset from the top
				firstErrorElement.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}
			return false;
		}

		window.scrollTo({ top: 0, behavior: "smooth" });
		return true;
	}, [goToNext]);

	const handlePrevious = useCallback(() => {
		goToPrevious();
		window.scrollTo({ top: 0, behavior: "smooth" });
	}, [goToPrevious]);

	const formMethods = methods;

	// Attach navigation functions to the form context
	(formMethods as unknown)._formNavigation = {
		goToNext,
		goToPrevious,
		isSubmitting,
		handleFormCompletion,
	};

	return (
		<div className="container mx-auto flex flex-col items-center">
			<FormProvider {...formMethods}>
				<div className="mb-20 md:mb-24 w-full">
					{isDesktop ? (
						<FormStepper steps={orderedSteps} currentStepId={currentStepId} />
					) : (
						<MobileStepper steps={orderedSteps} currentStepId={currentStepId} />
					)}
				</div>

				{/* Replace FormStepCard with conditional layout */}
				{currentStep?.layout === "preview" ? (
					<PreviewStepLayout>
						<form
							className="w-full"
							onSubmit={(e) => {
								e.preventDefault();
							}}
						>
							<AnimatePresence mode="wait">
								<motion.div
									key={currentStepId}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									{currentStep?.component && (
										<currentStep.component
											isSearchingEmail={
												currentStepId === FORM_STEPS.BASIC_INFO
													? isSearchingEmail
													: undefined
											}
										/>
									)}
								</motion.div>
							</AnimatePresence>
						</form>
					</PreviewStepLayout>
				) : (
					<FormStepLayout
						className={cn(
							currentStep?.id === FORM_STEPS.SERVICES ? "max-w-none" : null,
						)}
					>
						<form
							className="w-full min-h-[600px]"
							onSubmit={(e) => {
								e.preventDefault();
							}}
						>
							<AnimatePresence mode="wait">
								<motion.div
									key={currentStepId}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
									transition={{ duration: 0.2 }}
								>
									{currentStep?.component && (
										<currentStep.component
											isSearchingEmail={
												currentStepId === FORM_STEPS.BASIC_INFO
													? isSearchingEmail
													: undefined
											}
										/>
									)}
								</motion.div>
							</AnimatePresence>

							{currentStepId !== FORM_STEPS.REVIEW && (
								<StepNavigation
									isFirstStep={isFirstStep}
									isLastStep={isLastStep}
									isSubmitting={isSubmitting}
									onNext={handleNext}
									onPrevious={handlePrevious}
								/>
							)}
						</form>
					</FormStepLayout>
				)}
			</FormProvider>
		</div>
	);
};

const CreateServiceProviderForm = () => {
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
				<CreateServiceProviderFormContent />
				<FilesUploadDialog />
				<ProfileCreatedDialog />
				<VerifyEmailDialog />
			</UploadProvider>
			{process.env.NODE_ENV === "development" && (
				<ReactQueryDevtools initialIsOpen={false} />
			)}
		</QueryClientProvider>
	);
};

export default CreateServiceProviderForm;
