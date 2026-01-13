import { TemplateRegistry } from "../config/template-registry";
import type { TemplateDataMap, TemplateKey } from "../types";

export class TemplateService {
	getTemplate(key: TemplateKey) {
		const template = TemplateRegistry[key];
		if (!template) {
			throw new Error(`Template ${key} not found`);
		}
		return template;
	}

	validateTemplateData<T extends TemplateKey>(
		key: T,
		data: Record<string, unknown>,
	): data is TemplateDataMap[T] {
		const template = this.getTemplate(key);
		const requiredFields = Object.keys(template.requiredFields);

		return requiredFields.every((field) => field in data);
	}

	mergeWithSharedData<T extends TemplateKey>(
		templateData: TemplateDataMap[T],
	): TemplateDataMap[T] {
		return templateData;
	}
}
