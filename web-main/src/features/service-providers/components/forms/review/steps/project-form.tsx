"use client";

import { Controller, useFormContext, useWatch } from "react-hook-form";
import type { z } from "zod";

import { FileUpload } from "@/components/file-upload";
import { FormField } from "@/components/form-field";
import { FormRow } from "@/components/form-row";
import { FormSection } from "@/components/form-section";
import SelectServices from "@/components/select-services";
import { Body } from "@/components/ui/body";
import GenericFormError from "@/components/ui/form-error";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Label } from "@/components/ui/label";
import { LinkInput } from "@/components/ui/link-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import CashbackCalculator from "@/features/service-providers/components/cashback-calculator";
import { FileItem } from "@/features/service-providers/components/file-item";
import { useUpload } from "@/features/service-providers/context/upload-context";
import type { serviceProvidersContactFormSchema } from "@/features/service-providers/schemas/contact";

const getProjectBudgetAmount = (budget: {
	value: string;
	id: string;
	label: string;
}) => {
	if (!budget) return 100000;
	const budgetAmount = budget.label.split(" ").pop()?.replace(/^\$/, "");

	return budgetAmount ? Number.parseInt(budgetAmount) : 0;
};

export default function ProjectForm() {
	const { formState, control, register } =
		useFormContext<z.infer<typeof serviceProvidersContactFormSchema>>();
	const { errors } = formState;

	const { addFile, removeFile, filesToUpload } = useUpload();

	const handleFilesChange = (name: string, newFiles: File[]) => {
		for (const [index, file] of newFiles.entries()) {
			addFile(`${name}.${index}`, file);
		}
	};

	const handleDeleteFile = (fieldPath: string, file: File) => {
		removeFile(fieldPath);
	};

	const currentFiles = Array.from(filesToUpload.values());

	const filteredFiles = currentFiles
		.filter(({ fieldPath }) => fieldPath.startsWith("project.files"))
		.map((file) => ({
			file: file.file,
			fieldPath: file.fieldPath,
		}));

	const selectedBudget = useWatch({ control, name: "project.budget" });

	const projectBudgetAmount = getProjectBudgetAmount(selectedBudget);

	return (
		<div>
			<Heading as="h1" variants={"h3"} className="text-center mb-14 mt-6">
				Project information
			</Heading>
			<div className="flex flex-col">
				<FormSection>
					<Controller
						name="project.description"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<Textarea
								{...field}
								id={field.name}
								maxLength={5000}
								label={
									<div className="flex items-center gap-1">
										Project description*
										<InfoTooltip content="Provide a detailed description of the project to help us better understand the scope of the collaboration." />
									</div>
								}
								error={error?.message}
							/>
						)}
					/>

					<FormRow>
						<Controller
							name="project.budget"
							control={control}
							render={({ field }) => (
								<Select
									label="Budget"
									placeholder="Select budget"
									options={SERVICE_PROVIDER_BUDGET_OPTIONS}
									error={errors?.project?.budget?.message}
									defaultValue={field.value}
									{...field}
								/>
							)}
						/>

						<Controller
							name="project.timeline"
							control={control}
							render={({ field }) => (
								<Select
									label="Project Timeline"
									placeholder="Select timeline"
									options={SERVICE_PROVIDER_TIMELINE_OPTIONS}
									error={errors?.project?.timeline?.message}
									defaultValue={field.value}
									{...field}
								/>
							)}
						/>
					</FormRow>

					<CashbackCalculator amount={projectBudgetAmount} />

					<Controller
						control={control}
						name={"project.services"}
						render={({ field }) => {
							return (
								<SelectServices
									label="Service Categories"
									{...field}
									error={errors?.project?.services?.message}
								/>
							);
						}}
					/>
					<FormSection title="Proof of payment">
						<FormField
							name="project.proofOfPaymentUrl"
							label="Link to proof of payment"
							register={register}
						>
							<LinkInput prefix="https://" />
						</FormField>
						<div>
							<Label
								htmlFor="project.files"
								className="text-left flex items-center gap-2"
							>
								Upload proof of payment
								<InfoTooltip content="Attach an invoice, receipt, confirmation email, or any other proof of payment to speed up your cashback processing time. Accepted formats: PDF, JPEG, PNG" />
							</Label>
							<FileUpload
								name="project.files"
								config={{
									maxFiles: 3,
									maxTotalSize: 20_000_000,
									images: {
										maxSizePerFile: 10_000_000,
										acceptedTypes: {
											"image/*": [".jpg", ".jpeg", ".png"],
										},
									},
									documents: {
										maxSizePerFile: 10_000_000,
										acceptedTypes: {
											"application/pdf": [".pdf"],
										},
									},
								}}
								iconName="FileUp"
								label={(stats) => {
									return (
										<>
											<Body variants="14-medium" className="text-text-100 mb-2">
												<span className="text-primary-100 font-bold">
													Click to upload files
												</span>{" "}
												or drag and drop
											</Body>
											<Body variants="14-medium" className="text-text-300">
												Up to 3 files (max total size 20MB)
												<br />
												Images: Up to 3 files (max 10MB each) - JPG, PNG <br />
												Documents: 1 file (max 10MB each) - PDF
											</Body>

											{stats.images?.error && (
												<Body variants="14-medium" className="text-red-500">
													{stats.images?.error}
												</Body>
											)}

											{stats.documents?.error && (
												<Body variants="14-medium" className="text-red-500">
													{stats.documents?.error}
												</Body>
											)}
										</>
									);
								}}
								className="w-full mt-3"
								onFilesChange={handleFilesChange}
								currentFiles={filteredFiles.map((file) => file.file)}
							/>
							{errors?.project?.proofOfPaymentUrl?.message && (
								<GenericFormError
									message={errors?.project?.proofOfPaymentUrl?.message}
								/>
							)}
						</div>
					</FormSection>
					{filteredFiles.length > 0 && (
						<div className="mt-4 space-y-2">
							{filteredFiles.map(({ file, fieldPath }, fileIndex) => {
								return (
									<FileItem
										key={`${file.name}-${fileIndex}`}
										file={file}
										onDelete={(file) => {
											handleDeleteFile(fieldPath, file);
										}}
									/>
								);
							})}
						</div>
					)}
				</FormSection>
			</div>
		</div>
	);
}
