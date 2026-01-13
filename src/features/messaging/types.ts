import type { TemplateRegistry } from "./config/template-registry";

export type MessageChannel = "email";

// Helper type to extract the required fields type from a template
type InferRequiredFields<T> = T extends { requiredFields: infer R } ? R : never;

// Export template registry types
export type TemplateKey = keyof typeof TemplateRegistry;
export type TemplateAlias = (typeof TemplateRegistry)[TemplateKey]["alias"];

// Template data map using the registry
export type TemplateDataMap = {
	[K in TemplateKey]: InferRequiredFields<(typeof TemplateRegistry)[K]>;
};

// Message data type using the registry
export type MessageData<T extends TemplateKey> = {
	template: T;
	recipient: {
		email: string;
		name?: string;
	};
	data: TemplateDataMap[T];
	metadata?: Record<string, unknown>;
};

export interface MessageService {
	send<T extends TemplateKey>(message: MessageData<T>): Promise<void>;
	// sendBulk(messages: MessageData[]): Promise<void>;
}
