import { z } from "zod";

export const UploadRequestSchema = z.object({
	filename: z.string(),
	contentType: z.string(),
	size: z.number().positive(),
	fieldPath: z.string(),
	serviceProviderId: z.union([z.string().min(1), z.number()]),
});

export type UploadRequest = z.infer<typeof UploadRequestSchema>;
