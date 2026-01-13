import BasicInfoForm from "@/features/service-providers/components/forms/contact/steps/basic-info-form";
import CashbackForm from "@/features/service-providers/components/forms/contact/steps/cashback-form";
import ProjectForm from "@/features/service-providers/components/forms/contact/steps/project-form";
import type { FormStepConfig } from "@/types/form";

export const FORM_STEPS = {
	BASIC_INFO: "basicInformation",
	PROJECT: "project",
	CASHBCK: "cashback",
} as const;

export type FormStepId = (typeof FORM_STEPS)[keyof typeof FORM_STEPS];

export const FORM_STEPS_CONFIG: FormStepConfig[] = [
	{
		id: FORM_STEPS.BASIC_INFO,
		title: "Basic Information",
		order: 1,
		component: BasicInfoForm,
		validation: [FORM_STEPS.BASIC_INFO],
	},
	{
		id: FORM_STEPS.PROJECT,
		title: "Project",
		order: 2,
		component: ProjectForm,
		validation: [FORM_STEPS.PROJECT],
	},
	{
		id: FORM_STEPS.CASHBCK,
		title: "Cashback",
		order: 3,
		component: CashbackForm,
		validation: [FORM_STEPS.CASHBCK],
	},
];

export type Step = (typeof FORM_STEPS_CONFIG)[number];
