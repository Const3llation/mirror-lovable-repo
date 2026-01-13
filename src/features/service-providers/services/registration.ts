import type {
	StepSubmissionResponse,
	SubmitStepDataParams,
} from "@/features/service-providers/types/registration";

export const submitStepData = async ({
	stepId,
	data,
	serviceProviderId,
	isLastStep,
}: SubmitStepDataParams): Promise<StepSubmissionResponse> => {
	const response = await fetch("/api/providers", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			id: serviceProviderId,
			stepId,
			data,
			isLastStep,
		}),
	});

	if (!response.ok) {
		throw new Error("Failed to submit step data");
	}

	const result = await response.json();

	if (!result.isValid && result.errors) {
		throw new Error(Object.values(result.errors).join(", "));
	}

	return result;
};
