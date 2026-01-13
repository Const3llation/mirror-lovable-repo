"use client";

import { FormField } from "@/components/form-field";
import { FormRow } from "@/components/form-row";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import Hr from "@/components/ui/hr";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Select } from "@/components/ui/select";
import ImageUpload from "@/features/service-providers/components/image-upload";
import { COMPANY_SIZE_OPTIONS } from "@/features/service-providers/config/consts";
import type { serviceProviderFormSchema } from "@/features/service-providers/schemas/registration";
import { useCallback, useEffect } from "react";
import {
	type FieldErrors,
	type UseFormRegister,
	useFieldArray,
	useFormContext,
} from "react-hook-form";
import { Controller } from "react-hook-form";
import type { z } from "zod";

type PersonCardProps = {
	member: z.infer<
		typeof serviceProviderFormSchema
	>["team"]["teamMembers"][number];
	index: number;
	register: UseFormRegister<z.infer<typeof serviceProviderFormSchema>>;
	errors: FieldErrors<z.infer<typeof serviceProviderFormSchema>>;
	removeTeamMember: (index: number) => void;
};

const PersonCard = (props: PersonCardProps) => {
	const { register, errors, index, removeTeamMember, control } = props;

	return (
		<div>
			<div className="flex flex-col gap-6 sm:flex-row justify-between items-center mb-6">
				<Heading as="h2" variants={"h5"}>
					Team member {index + 1}
				</Heading>
				<Button
					variant="secondary"
					size="md"
					onClick={() => removeTeamMember(index)}
					className="w-full sm:w-auto text-error hover:text-error hover:bg-error/10"
				>
					Remove
				</Button>
			</div>
			<Controller
				name={`team.teamMembers.${index}.image`}
				control={control}
				render={({ field: { onChange, value }, fieldState: { error } }) => {
					return (
						<ImageUpload
							fieldPath={`team.teamMembers.${index}.image`}
							rounded
							onChange={(value) => {
								onChange(value);
							}}
							value={value}
							error={error}
						/>
					);
				}}
			/>

			<FormRow className="my-6 md:flex-row flex-col">
				<FormField
					name={`team.teamMembers.${index}.firstName`}
					label="First name"
					placeholder="John"
					register={register}
					error={errors.team?.teamMembers?.[index]?.firstName?.message}
				/>
				<FormField
					name={`team.teamMembers.${index}.lastName`}
					label="Last name"
					placeholder="Doe"
					register={register}
					error={errors.team?.teamMembers?.[index]?.lastName?.message}
				/>
			</FormRow>

			<FormRow className="mb-14">
				<FormField
					name={`team.teamMembers.${index}.position`}
					label="Job position"
					register={register}
					placeholder="CEO"
					error={errors.team?.teamMembers?.[index]?.position?.message}
				/>
			</FormRow>
		</div>
	);
};

const emptyTeamMember = {
	firstName: "",
	lastName: "",
	position: "",
};

const TeamForm = () => {
	const {
		register,
		control,
		formState: { errors },
	} = useFormContext<z.infer<typeof serviceProviderFormSchema>>();

	const {
		fields: teamMembers,
		append: appendTeamMember,
		remove: removeTeamMember,
	} = useFieldArray({
		control,
		name: "team.teamMembers",
	});

	const addTeamMember = useCallback(() => {
		if (teamMembers.length < 5) {
			appendTeamMember(emptyTeamMember);
		}
	}, [appendTeamMember, teamMembers.length]);

	useEffect(() => {
		if (teamMembers.length === 0) {
			addTeamMember();
		}
	}, [addTeamMember, teamMembers.length]);

	return (
		<div className="mb-14">
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Team information
			</Heading>

			<div className="flex flex-col gap-6 mb-14">
				<Controller
					name="team.companySize"
					control={control}
					render={({ field }) => (
						<Select
							options={COMPANY_SIZE_OPTIONS}
							placeholder="Select company size"
							error={errors.team?.companySize?.message}
							defaultValue={field.value}
							{...field}
						/>
					)}
				/>
			</div>

			{teamMembers.map((member, index) => (
				<PersonCard
					key={member.id}
					index={index}
					member={member}
					register={register}
					errors={errors}
					removeTeamMember={removeTeamMember}
				/>
			))}

			<Hr />
			<div className="flex gap-4 flex-col items-center my-8">
				<div>
					<Button
						variant="primary"
						onClick={addTeamMember}
						disabled={teamMembers.length >= 5}
					>
						Add team member
					</Button>
				</div>
				<div className="flex items-center gap-2">
					<InfoTooltip content="If you need to add more than 5 team members, please contact us at support@serviceprovider.com" />
					<Body>A maximum of 5 team members can be added</Body>
				</div>
			</div>
			<Hr />
		</div>
	);
};

export default TeamForm;
