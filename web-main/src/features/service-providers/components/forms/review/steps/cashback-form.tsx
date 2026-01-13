"use client";
import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FormField } from "@/components/form-field";

import { FormRow } from "@/components/form-row";
import { FormSection } from "@/components/form-section";
import { Body } from "@/components/ui/body";
import Checkbox from "@/components/ui/checkbox";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { CRYPTO_OPTIONS } from "@/config/consts";
import type { serviceProvidersReviewFormSchema } from "@/features/service-providers/schemas/review";
import { cn } from "@/utils/cn";
import Link from "next/link";

export default function CashbackForm() {
	const { register, control, formState } =
		useFormContext<z.infer<typeof serviceProvidersReviewFormSchema>>();
	const { errors } = formState;

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Get 5% Cashback
			</Heading>
			<div className="flex flex-col">
				<FormSection>
					<FormRow>
						<Controller
							name="cashback.crypto"
							control={control}
							render={({ field }) => (
								<Select
									label={
										<div className="flex flex-row gap-2">
											<Label htmlFor="crypto">Crypto*</Label>
											<InfoTooltip content="Select the crypto you want to receive your cashback in." />
										</div>
									}
									placeholder="Select crypto"
									options={CRYPTO_OPTIONS}
									error={errors?.cashback?.crypto?.message}
									defaultValue={field.value}
									{...field}
								/>
							)}
						/>

						<FormField
							name="cashback.walletAddress"
							label={
								<div className="flex flex-row gap-2">
									<Label htmlFor="walletAddress">Wallet address *</Label>
									<InfoTooltip content="Enter your wallet address here to receive your 5% reward in cryptocurrency. Make sure it’s correct to avoid any issues with your payout." />
								</div>
							}
							register={register}
							error={errors.cashback?.walletAddress?.message}
							placeholder="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa"
						/>
					</FormRow>
					<Controller
						name="cashback.acceptPrivacyPolicy"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<div className="flex flex-col gap-2">
								<div className="flex flex-row gap-2">
									<Checkbox
										id={field.name}
										checked={field.value}
										onChange={field.onChange}
										onClick={(e) => e.stopPropagation()}
									/>
									<Body
										variants="14-medium"
										className={cn(
											error?.message ? "text-red-500" : "text-text-300",
										)}
									>
										I accept the{" "}
										<Link
											href="/privacy-policy"
											className="underline"
											target="_blank"
										>
											Privacy Policy.
										</Link>
									</Body>
								</div>
								{error?.message && (
									<Body variants="14-regular" className="text-red-500">
										{error.message}
									</Body>
								)}
							</div>
						)}
					/>
				</FormSection>
			</div>
		</div>
	);
}
