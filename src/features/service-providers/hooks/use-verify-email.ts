import { useMutation } from "@tanstack/react-query";

interface VerificationResponse {
	message: string;
}

interface ErrorResponse {
	error: string;
	details?: Record<string, unknown>;
}

interface MutationCallbacks {
	onSuccess?: () => void;
	onError?: (error: ErrorResponse) => void;
}

interface UseVerifyEmailReturn {
	// Request initial verification
	requestVerification: {
		mutate: (params: { email: string } & MutationCallbacks) => void;
		isPending: boolean;
		error: ErrorResponse | null;
	};
	// Submit verification code
	verifyCode: {
		mutate: (
			params: { email: string; code: string } & MutationCallbacks,
		) => void;
		isPending: boolean;
		error: ErrorResponse | null;
		isSuccess: boolean;
	};
	// Resend verification code
	resendCode: {
		mutate: (params: { email: string } & MutationCallbacks) => void;
		isPending: boolean;
		error: ErrorResponse | null;
	};
}

export function useVerifyEmail(): UseVerifyEmailReturn {
	// Request initial verification
	const {
		mutate: requestMutate,
		isPending: isRequestPending,
		error: requestError,
	} = useMutation({
		mutationFn: async ({
			email,
			onSuccess,
			onError,
		}: {
			email: string;
		} & MutationCallbacks) => {
			const response = await fetch("/api/providers/verify-email", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const error = await response.json();
				onError?.(error);
				throw error;
			}

			onSuccess?.();
			return response.json() as Promise<VerificationResponse>;
		},
	});

	// Verify code
	const {
		mutate: verifyMutate,
		isPending: isVerifyPending,
		error: verifyError,
		isSuccess: isVerifySuccess,
	} = useMutation({
		mutationFn: async ({
			email,
			code,
			onSuccess,
			onError,
		}: {
			email: string;
			code: string;
		} & MutationCallbacks) => {
			const response = await fetch("/api/providers/verify-email/verify", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, code }),
			});

			if (!response.ok) {
				const error = await response.json();
				onError?.(error);
				throw error;
			}

			onSuccess?.();
			return response.json() as Promise<VerificationResponse>;
		},
	});

	// Resend verification code
	const {
		mutate: resendMutate,
		isPending: isResendPending,
		error: resendError,
	} = useMutation({
		mutationFn: async ({
			email,
			onSuccess,
			onError,
		}: {
			email: string;
		} & MutationCallbacks) => {
			const response = await fetch("/api/providers/verify-email/resend", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email }),
			});

			if (!response.ok) {
				const error = await response.json();
				onError?.(error);
				throw error;
			}

			onSuccess?.();
			return response.json() as Promise<VerificationResponse>;
		},
	});

	return {
		requestVerification: {
			mutate: requestMutate,
			isPending: isRequestPending,
			error: requestError as ErrorResponse | null,
		},
		verifyCode: {
			mutate: verifyMutate,
			isPending: isVerifyPending,
			error: verifyError as ErrorResponse | null,
			isSuccess: isVerifySuccess,
		},
		resendCode: {
			mutate: resendMutate,
			isPending: isResendPending,
			error: resendError as ErrorResponse | null,
		},
	};
}
