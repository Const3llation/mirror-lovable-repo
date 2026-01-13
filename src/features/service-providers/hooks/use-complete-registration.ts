import { useMutation } from "@tanstack/react-query";

interface CompleteRegistrationParams {
	providerId: string;
}

export function useCompleteRegistration() {
	return useMutation({
		mutationFn: async ({ providerId }: CompleteRegistrationParams) => {
			const response = await fetch("/api/providers/complete-registration", {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ providerId }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || "Failed to complete registration");
			}

			return response.json();
		},
	});
}
