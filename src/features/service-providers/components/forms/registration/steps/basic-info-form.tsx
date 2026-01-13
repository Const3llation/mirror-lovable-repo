"use client";
import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "@/components/form-field";
import { Icon } from "@/components/ui/icon";
import { PhoneInput } from "@/components/ui/phone-input";
import { Select } from "@/components/ui/select";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";

import { FormRow } from "@/components/form-row";
import { FormSection } from "@/components/form-section";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import { LinkInput } from "@/components/ui/link-input";
import { getSupportedCountriesOptions } from "@/utils/country";
import { Loader2 } from "lucide-react";

const countries = getSupportedCountriesOptions().map((country) => ({
	id: country.value,
	label: country.label,
	value: country.value,
}));

type BasicInfoFormProps = {
	isSearchingEmail?: boolean;
};

export default function BasicInfoForm({
	isSearchingEmail,
}: BasicInfoFormProps) {
	const { register, formState, control } =
		useFormContext<z.infer<typeof serviceProviderFormSchema>>();
	const { errors } = formState;

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Get Your Company Const3llation Verified
			</Heading>
			<div className="flex flex-col">
				<FormSection title="Contact information">
					<FormRow className="md:flex-row flex-col">
						<div className="relative md:mb-0 mb-4">
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
								decorator={
									isSearchingEmail && (
										<div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
											<Loader2 className="h-6 w-6 animate-spin text-gray-500" />
										</div>
									)
								}
							/>
						</div>

						<Controller
							name="basicInformation.phoneNumber"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<PhoneInput
										placeholder="+1234567890"
										label="Phone number *"
										error={errors.basicInformation?.phoneNumber?.message}
										value={value}
										onChange={onChange}
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
								<InfoTooltip content="We will use it to communicate and engage directly with users, making it easy to share updates, answer questions, and gather feedback. If you don't have a Telegram account, you can easily sign up at telegram.org." />
							</div>
						}
						register={register}
						error={errors.basicInformation?.telegramUsername?.message}
						placeholder="@username"
					/>

					<FormField
						name="basicInformation.websiteUrl"
						label="Website *"
						register={register}
						error={errors.basicInformation?.websiteUrl?.message}
						placeholder="www.example.com"
					>
						<LinkInput prefix="https://" />
					</FormField>
				</FormSection>

				<FormSection title="Company information">
					<FormField
						name="basicInformation.providerName"
						label="Company name *"
						register={register}
						error={errors.basicInformation?.providerName?.message}
						placeholder="Acme Inc."
					/>
					<FormField
						name="basicInformation.foundedYear"
						label="Founded year *"
						type="number"
						inputMode="numeric"
						register={register}
						error={errors.basicInformation?.foundedYear?.message}
						placeholder="2024"
					/>
				</FormSection>

				<FormSection title="Company address">
					<FormRow className="md:flex-row flex-col">
						<FormField
							name="basicInformation.state"
							label="State *"
							register={register}
							error={errors.basicInformation?.state?.message}
							placeholder="California"
							className="md:mb-0 mb-4"
						/>
						<Controller
							name="basicInformation.country"
							control={control}
							render={({ field: { onChange, value } }) => {
								return (
									<Select
										label="Country *"
										options={countries}
										onChange={(option) => onChange(option?.value)}
										placeholder="Select country"
										error={errors.basicInformation?.country?.message}
										value={countries.find((country) => country.value === value)}
									/>
								);
							}}
						/>
					</FormRow>
					<FormRow className="md:flex-row flex-col">
						<FormField
							name="basicInformation.streetAddress"
							label="Street address *"
							register={register}
							error={errors.basicInformation?.streetAddress?.message}
							placeholder="123 Main St"
							className="md:mb-0 mb-4"
						/>
						<FormField
							name="basicInformation.postalCode"
							label="Postal number *"
							register={register}
							error={errors.basicInformation?.postalCode?.message}
							placeholder="12345"
						/>
					</FormRow>

					<FormField
						name="basicInformation.city"
						label="City *"
						register={register}
						error={errors.basicInformation?.city?.message}
						placeholder="Anytown"
					/>
				</FormSection>
			</div>
		</div>
	);
}
