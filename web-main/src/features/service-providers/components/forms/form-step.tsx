"use client";

import BasicInfoForm from "@/features/service-providers/components/forms/basic-info-form";
import BrandingForm from "@/features/service-providers/components/forms/branding-form";
import PortfolioForm from "@/features/service-providers/components/forms/portfolio-form";
import ServicesForm from "@/features/service-providers/components/forms/services-form";
import SocialsForm from "@/features/service-providers/components/forms/socials-form";
import TeamForm from "@/features/service-providers/components/forms/team-form";
import {
	FORM_STEPS,
	type FormStepId,
} from "@/features/service-providers/config/forms/registration";
import { match } from "ts-pattern";

interface FormStepProps {
	step: FormStepId;
}

export const FormStep = ({ step }: FormStepProps) => {
	const stepComponent = match(step)
		.with(FORM_STEPS.BASIC_INFO, () => <BasicInfoForm />)
		.with(FORM_STEPS.BRANDING, () => <BrandingForm />)
		.with(FORM_STEPS.SERVICES, () => <ServicesForm />)
		.with(FORM_STEPS.SOCIAL_MEDIA, () => <SocialsForm />)
		.with(FORM_STEPS.PORTFOLIO, () => <PortfolioForm />)
		.with(FORM_STEPS.TEAM, () => <TeamForm />)
		.otherwise(() => null);

	return <>{stepComponent}</>;
};
