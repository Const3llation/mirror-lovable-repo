import BasicInfoForm from "@/features/service-providers/components/forms/registration/steps/basic-info-form";
import BrandingForm from "@/features/service-providers/components/forms/registration/steps/branding-form";
import PortfolioForm from "@/features/service-providers/components/forms/registration/steps/portfolio-form";
import ReviewForm from "@/features/service-providers/components/forms/registration/steps/review-form";
import ServicesForm from "@/features/service-providers/components/forms/registration/steps/services-form";
import SocialsForm from "@/features/service-providers/components/forms/registration/steps/socials-form";
import TeamForm from "@/features/service-providers/components/forms/registration/steps/team-form";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";
import type { FormStepConfig } from "@/types/form";
import type { z } from "zod";

export const FORM_STEPS = {
	BASIC_INFO: "basicInformation",
	BRANDING: "branding",
	SERVICES: "services",
	PORTFOLIO: "portfolio",
	SOCIAL_MEDIA: "socialMedia",
	TEAM: "team",
	REVIEW: "review",
} as const;

export type FormStepId = (typeof FORM_STEPS)[keyof typeof FORM_STEPS];

type ServiceProviderFormData = z.infer<typeof serviceProviderFormSchema>;

export const FORM_STEPS_CONFIG: FormStepConfig<ServiceProviderFormData>[] = [
	{
		id: FORM_STEPS.BASIC_INFO,
		title: "Basic Information",
		order: 0,
		component: BasicInfoForm,
		validation: [FORM_STEPS.BASIC_INFO],
		layout: "form",
	},
	{
		id: FORM_STEPS.PORTFOLIO,
		title: "Portfolio",
		order: 3,
		component: PortfolioForm,
		validation: [FORM_STEPS.PORTFOLIO],
		layout: "form",
	},
	{
		id: FORM_STEPS.REVIEW,
		title: "Review",
		order: 6,
		component: ReviewForm,
		validation: [FORM_STEPS.REVIEW],
		layout: "preview",
	},
	{
		id: FORM_STEPS.BRANDING,
		title: "Branding",
		order: 1,
		component: BrandingForm,
		validation: [FORM_STEPS.BRANDING],
		layout: "form",
	},
	{
		id: FORM_STEPS.TEAM,
		title: "Team information",
		order: 5,
		component: TeamForm,
		validation: [FORM_STEPS.TEAM],
		layout: "form",
	},

	{
		id: FORM_STEPS.SERVICES,
		title: "Service categories",
		order: 2,
		component: ServicesForm,
		validation: [FORM_STEPS.SERVICES],
		layout: "form",
	},
	{
		id: FORM_STEPS.SOCIAL_MEDIA,
		title: "Social Media",
		order: 4,
		component: SocialsForm,
		validation: [FORM_STEPS.SOCIAL_MEDIA],
		layout: "form",
	},
];

export type Step = (typeof FORM_STEPS_CONFIG)[number];
