"use client";
import { useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "@/components/form-field";
import { Icon } from "@/components/ui/icon";

import { FormRow } from "@/components/form-row";
import { FormSection } from "@/components/form-section";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import type { serviceProvidersContactFormSchema } from "@/features/service-providers/schemas/contact";

export default function BasicInfoForm() {
	const { register, formState } =
		useFormContext<z.infer<typeof serviceProvidersContactFormSchema>>();
	const { errors } = formState;

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Contact for Inquiries
			</Heading>
			<div className="flex flex-col">
				<FormSection>
					<FormRow>
						<FormField
							name="basicInformation.firstName"
							label="First name *"
							register={register}
							error={errors.basicInformation?.firstName?.message}
							placeholder="John"
						/>
						<FormField
							name="basicInformation.lastName"
							label="Last name *"
							register={register}
							error={errors.basicInformation?.lastName?.message}
							placeholder="Doe"
						/>
					</FormRow>

					<FormField
						name="basicInformation.email"
						label="Work email *"
						type="email"
						inputMode="email"
						placeholder="hello@acme.com"
						register={register}
						error={errors.basicInformation?.email?.message}
						icon={
							<Icon
								name="MailIcon"
								width={20}
								height={20}
								className="text-primary-100"
							/>
						}
					/>

					<FormField
						name="basicInformation.telegramUsername"
						label={
							<div className="flex items-center gap-1">
								Telegram *
								<InfoTooltip content="Enter your Telegram username here to connect directly with the service provider. Telegram is a messaging app where you can communicate in real-time. If you don’t have a Telegram account, you can easily sign up at telegram.org." />
							</div>
						}
						register={register}
						error={errors.basicInformation?.telegramUsername?.message}
						placeholder="@username"
					/>
				</FormSection>
			</div>
		</div>
	);
}
