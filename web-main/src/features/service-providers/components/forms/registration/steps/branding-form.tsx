"use client";

import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FormSection } from "@/components/form-section";
import { Heading } from "@/components/ui/heading";
import { Textarea } from "@/components/ui/textarea";
import ImageUpload from "@/features/service-providers/components/image-upload";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";

export default function BrandingForm() {
	const { control } =
		useFormContext<z.infer<typeof serviceProviderFormSchema>>();

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Branding
			</Heading>

			<div className="flex flex-col">
				<FormSection>
					<Controller
						name="branding.logo"
						control={control}
						render={({ field: { onChange, value }, fieldState: { error } }) => {
							return (
								<ImageUpload
									fieldPath="branding.logo"
									onChange={(value) => {
										onChange(value);
									}}
									value={value}
									error={error}
								/>
							);
						}}
					/>
				</FormSection>
				<FormSection>
					<Controller
						name="branding.shortDescription"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<Textarea
								{...field}
								id={field.name}
								maxLength={300}
								label="Short description"
								error={error?.message}
							/>
						)}
					/>

					<Controller
						name="branding.longDescription"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<Textarea
								{...field}
								id={field.name}
								maxLength={600}
								className="min-h-[250px]"
								label="Long description"
								error={error?.message}
							/>
						)}
					/>
				</FormSection>
			</div>
		</div>
	);
}
