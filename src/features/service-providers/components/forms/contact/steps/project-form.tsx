"use client";
import { Controller, useFormContext } from "react-hook-form";
import type { z } from "zod";

import { FileUpload } from "@/components/file-upload";
import { FormRow } from "@/components/form-row";
import { FormSection } from "@/components/form-section";
import SelectServices from "@/components/select-services";
import { Heading } from "@/components/ui/heading";
import { InfoTooltip } from "@/components/ui/info-icon";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import { FileItem } from "@/features/service-providers/components/file-item";
import { useUpload } from "@/features/service-providers/context/upload-context";
import type { serviceProvidersContactFormSchema } from "@/features/service-providers/schemas/contact";

export default function ProjectForm() {
	const { register, formState, control } =
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
										<InfoTooltip content="Tell us about your project. Describe the key goals, requirements, and any specifics you want the service provider to consider. This helps them understand your needs and provide a tailored proposal" />
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
					<Controller
						name="project.additionalDetails"
						control={control}
						render={({ field, fieldState: { error } }) => (
							<Textarea
								{...field}
								id={field.name}
								maxLength={600}
								label={
									<div className="flex items-center gap-1">
										Additional details / Requirements*
										<InfoTooltip content="Provide any additional details that will help the service provider better understand your requirements. Include any technical specifications, preferences, or any other relevant information that might influence their approach to the project." />
									</div>
								}
								error={error?.message}
							/>
						)}
					/>
					<div>
						<Label
							htmlFor="project.files"
							className="text-left flex items-center gap-2"
						>
							Media upload *
							<InfoTooltip content="Upload up to 5 relevant documents, images, or files that provide a clearer picture of your project. This could include sketches, wireframes, previous work examples, or any materials that will help the service provider understand your vision better." />
						</Label>
						<FileUpload
							name="project.files"
							config={{
								maxFiles: 1,
								maxTotalSize: 100_000_000,
								documents: {
									maxSizePerFile: 100_000_000,
									acceptedTypes: {
										"application/pdf": [".pdf"],
										"application/msword": [".doc"],
										"application/vnd.openxmlformats-officedocument.wordprocessingml.document":
											[".docx"],
										"application/vnd.ms-powerpoint": [".ppt"],
										"application/vnd.openxmlformats-officedocument.presentationml.presentation":
											[".pptx"],
										"application/vnd.ms-excel": [".xls"],
										"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet":
											[".xlsx"],
									},
								},
							}}
							iconName="FileUp"
							label={(stats) => {
								return (
									<>
										<p>
											<span className="text-primary-100 font-bold">
												Click to upload files
											</span>{" "}
											or drag and drop files
										</p>
										{(stats.images.error || stats.documents.error) && (
											<p className="text-red-500">
												{stats.images.error || stats.documents.error}
											</p>
										)}
									</>
								);
							}}
							className="w-full mt-3"
							onFilesChange={handleFilesChange}
							currentFiles={filteredFiles.map((file) => file.file)}
						/>
					</div>

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
