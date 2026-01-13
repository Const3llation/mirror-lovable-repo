"use client";

import { FormField } from "@/components/form-field";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import Checkbox from "@/components/ui/checkbox";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { verifyProviderSchema } from "@/features/service-providers/schemas/verify";
import { zodResolver } from "@hookform/resolvers/zod";
import { MailIcon } from "lucide-react";
import Link from "next/link";
import { Controller, useForm } from "react-hook-form";
import type { z } from "zod";

type CreateVerifyFormProps = {
	onSubmit: (data: z.infer<typeof verifyProviderSchema>) => void;
	onCancel: () => void;
	isPending: boolean;
};

const JOB_POSITIONS = [
	{ id: "owner", label: "Owner", value: "owner" },
	{ id: "manager", label: "Manager", value: "manager" },
	{ id: "investor", label: "Investor", value: "investor" },
	{ id: "other", label: "Other", value: "other" },
] as const;

function CreateVerifyForm({
	onSubmit,
	onCancel,
	isPending,
}: CreateVerifyFormProps) {
	const { register, control, handleSubmit, formState } = useForm<
		z.infer<typeof verifyProviderSchema>
	>({
		resolver: zodResolver(verifyProviderSchema),
		defaultValues: {
			firstName: "",
			lastName: "",
			workEmail: "",
			jobPosition: "",
			note: "",
			privacyPolicy: false,
		},
		mode: "onSubmit",
		reValidateMode: "onSubmit",
	});

	const handleSendMessage = handleSubmit(async (data) => {
		onSubmit(data);
	});

	return (
		<div className="flex flex-col gap-14 w-full">
			<div className="flex flex-col gap-8 w-full">
				<div className="flex flex-col lg:flex-row gap-6 w-full">
					<FormField
						error={formState.errors.firstName?.message}
						name="firstName"
						label="First Name*"
						register={register}
						className="w-full"
						placeholder="John"
					/>
					<FormField
						error={formState.errors.lastName?.message}
						name="lastName"
						label="Last Name*"
						register={register}
						className="w-full"
						placeholder="Doe"
					/>
				</div>
				<FormField
					error={formState.errors.workEmail?.message}
					name="workEmail"
					label="Work email*"
					register={register}
					className="w-full"
					icon={<MailIcon size={18} className="text-primary-100" />}
					type="email"
					placeholder="john@example.com"
				/>
				<Controller
					name="jobPosition"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<Select
							{...field}
							label="Job Position*"
							options={JOB_POSITIONS}
							value={JOB_POSITIONS.find(
								(position) => position.value === field.value,
							)}
							onChange={(option) => field.onChange(option?.value)}
							error={error?.message}
							placeholder="Select job position"
						/>
					)}
				/>
				<Controller
					name="note"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<Textarea
							{...field}
							id={field.name}
							maxLength={600}
							label={
								<div className="flex items-center gap-1">
									<label className="block text-sm font-medium">Note*</label>
									<InfoTooltip content="Provide any additional notes that may help with the verification process. This could include details about your services, special qualifications, or any specific aspects you'd like to highlight." />
								</div>
							}
							error={error?.message}
							placeholder="Note"
						/>
					)}
				/>
				<Controller
					name="privacyPolicy"
					control={control}
					render={({ field, fieldState: { error } }) => (
						<div className="flex flex-col gap-2">
							<div className="flex flex-row gap-2">
								<Checkbox
									id={field.name}
									checked={field.value}
									onChange={field.onChange}
									onClick={(e) => e.stopPropagation()}
									error={error?.message}
								/>
								<Body variants="14-medium" className="text-text-300">
									I accept the &nbsp;
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
			</div>
			<div className="mx-auto flex w-full gap-4">
				<Button
					variant="secondary"
					size="md"
					fullWidth
					onClick={onCancel}
					disabled={isPending}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					variant="primary"
					size="md"
					className="px-20"
					onClick={handleSendMessage}
					fullWidth
					disabled={isPending}
				>
					<Body variants="16-regular" className="text-text-100">
						{isPending ? "Submitting..." : "Submit"}
					</Body>
				</Button>
			</div>
		</div>
	);
}

export default CreateVerifyForm;
