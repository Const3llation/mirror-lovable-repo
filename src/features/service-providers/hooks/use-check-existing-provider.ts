import { useQuery } from "@tanstack/react-query";

interface UseCheckExistingProviderProps {
	email?: string;
	enabled?: boolean;
}

export function useCheckExistingProvider({
	email,
	enabled = false,
}: UseCheckExistingProviderProps) {
	return useQuery({
		queryKey: ["existing-provider", email],
		queryFn: async () => {
			const response = await fetch(
				`/api/providers?email=${email}&registrationProcessStatus=In Progress&depth=2`,
			);
			if (!response.ok) throw new Error("Failed to fetch provider");
			return response.json();
		},
		enabled: enabled && !!email,
		refetchOnWindowFocus: false,
	});
}
