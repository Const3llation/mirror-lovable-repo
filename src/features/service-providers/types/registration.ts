export type RegistrationStatus = "IN_PROGRESS" | "COMPLETED";

export interface StepData {
	stepId: string;
	isComplete: boolean;
	lastUpdated: string;
	data: Record<string, unknown>;
}

export interface ServiceProviderRegistration {
	serviceProviderId: string | null;
	currentStep: string;
	steps: Record<string, StepData>;
	registrationStatus: RegistrationStatus;
}

export interface StepSubmissionRequest {
	serviceProviderId?: string;
	stepId: string;
	data: Record<string, unknown>;
	isLastStep: boolean;
}

export interface StepSubmissionResponse {
	serviceProviderId: string;
	stepId: string;
	isValid: boolean;
	errors?: Record<string, string>;
}

export interface SubmitStepDataParams {
	stepId: string;
	data: Record<string, unknown>;
	serviceProviderId?: string;
	isLastStep: boolean;
}
