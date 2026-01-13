import { useMutation } from "@tanstack/react-query";
import type { z } from "zod";

import type { verifyProviderSchema } from "../schemas/verify";

type VerifyProviderData = z.infer<typeof verifyProviderSchema>;

export const useSendVerifyProvider = () => {
	return useMutation({
		mutationFn: async (data: VerifyProviderData & { slug: string }) => {
			const response = await fetch("/api/providers/verify", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});

			if (!response.ok) {
				throw new Error("Failed to verify provider");
			}

			return response.json();
		},
	});
};
