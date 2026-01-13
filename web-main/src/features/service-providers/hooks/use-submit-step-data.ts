import { submitStepData } from "@/features/service-providers/services/registration";
import type { StepSubmissionResponse } from "@/features/service-providers/types/registration";
import { type UseMutationOptions, useMutation } from "@tanstack/react-query";

const useSubmitStepData = (
	options?: UseMutationOptions<StepSubmissionResponse, Error, unknown>,
) => {
	return useMutation<StepSubmissionResponse, Error, unknown>({
		mutationFn: submitStepData,
		...options,
	});
};

export default useSubmitStepData;
