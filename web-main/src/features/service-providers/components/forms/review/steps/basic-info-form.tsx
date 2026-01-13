"use client";
import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "@/components/form-field";
import { Icon } from "@/components/ui/icon";

import { FormRow } from "@/components/form-row";
import { FormSection } from "@/components/form-section";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import { PhoneInput } from "@/components/ui/phone-input";
import type { serviceProvidersReviewFormSchema } from "@/features/service-providers/schemas/review";

export default function BasicInfoForm() {
	const { register, control, formState } =
		useFormContext<z.infer<typeof serviceProvidersReviewFormSchema>>();
	const { errors } = formState;

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Submit your review
			</Heading>
			<div className="flex flex-col">
				<FormSection>
					<FormRow className="md:flex-row flex-col">
						<FormField
							name="basicInformation.firstName"
							label="First name *"
							register={register}
							error={errors.basicInformation?.firstName?.message}
							placeholder="John"
							className="md:mb-0 mb-4"
						/>
						<FormField
							name="basicInformation.lastName"
							label="Last name *"
							register={register}
							error={errors.basicInformation?.lastName?.message}
							placeholder="Doe"
						/>
					</FormRow>
				</FormSection>

				<FormSection title="Contact information">
					<FormRow className="md:flex-row flex-col">
						<FormField
							name="basicInformation.email"
							label="Work email *"
							type="email"
							inputMode="email"
							placeholder="hello@acme.com"
							register={register}
							error={errors.basicInformation?.email?.message}
							className="md:mb-0 mb-4"
							icon={
								<Icon
									name="MailIcon"
									width={20}
									height={20}
									className="text-primary-100"
								/>
							}
						/>

						<Controller
							name="basicInformation.phoneNumber"
							control={control}
							render={({ field }) => {
								return (
									<PhoneInput
										placeholder="+1234567890"
										label="Phone number *"
										error={errors.basicInformation?.phoneNumber?.message}
										value={field.value}
										onChange={(value) => {
											// Note: Phone inputs triggers onChange when mounting so it triggers form validation.
											//       We are doing this to prevent the form from being submitted with an empty phone number.
											if (value.target.value.length >= 3) {
												field.onChange(value);
											}
										}}
									/>
								);
							}}
						/>
					</FormRow>

					<FormField
						name="basicInformation.telegramUsername"
						label={
							<div className="flex items-center gap-1">
								Telegram *
								<InfoTooltip content="Enter your Telegram username here to connect directly with the service provider. Telegram is a messaging app where you can communicate in real-time. If you don't have a Telegram account, you can easily sign up at telegram.org." />
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
