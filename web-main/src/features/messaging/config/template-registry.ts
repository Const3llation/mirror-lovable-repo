import { ADMIN_TEMPLATES } from "./templates/admin";
import { CLIENT_TEMPLATES } from "./templates/client";
import { PROVIDER_TEMPLATES } from "./templates/provider";

export const TemplateRegistry = {
	...ADMIN_TEMPLATES,
	...CLIENT_TEMPLATES,
	...PROVIDER_TEMPLATES,
} as const;

// Type-safe template validator
export type TemplateKey = keyof typeof TemplateRegistry;
export type TemplateData<T extends TemplateKey> =
	(typeof TemplateRegistry)[T]["requiredFields"];
