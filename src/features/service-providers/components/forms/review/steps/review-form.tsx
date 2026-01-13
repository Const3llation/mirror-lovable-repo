"use client";
import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FormSection } from "@/components/form-section";
import { Body } from "@/components/ui/body";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Textarea } from "@/components/ui/textarea";
import { StarsRating } from "@/features/service-providers/components/stars-rating";
import type { serviceProvidersReviewFormSchema } from "@/features/service-providers/schemas/review";

export default function ReviewForm() {
	const { control, formState } =
		useFormContext<z.infer<typeof serviceProvidersReviewFormSchema>>();
	const { errors } = formState;

	return (
		<div className="mb-14">
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Review
			</Heading>
			<div className="flex flex-col">
				<FormSection>
					<div className="flex flex-col items-center justify-center gap-8">
						<Body variants="16-regular" className="text-text-200">
							Overall rating
						</Body>
						<Controller
							name="review.rating"
							control={control}
							render={({ field: { value, onChange } }) => (
								<div className="flex flex-col items-center gap-4">
									<StarsRating value={value ?? 0} onChange={onChange} />
									{errors?.review?.rating?.message && (
										<Body variants="14-regular" className="text-red-500">
											{errors?.review?.rating?.message}
										</Body>
									)}
								</div>
							)}
						/>
					</div>
				</FormSection>
			</div>

			<Controller
				name="review.review"
				control={control}
				render={({ field, fieldState: { error } }) => (
					<Textarea
						{...field}
						id={field.name}
						maxLength={600}
						label={
							<div className="flex items-center gap-1">
								Review*
								<InfoTooltip content="Share your feedback and experiences with this service provider to help others make informed choices." />
							</div>
						}
						error={error?.message}
					/>
				)}
			/>
		</div>
	);
}
