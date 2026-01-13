"use client";
import {
	type Control,
	Controller,
	type FieldError,
	type FieldValues,
	type UseFormRegister,
} from "react-hook-form";
import { useFormContext } from "react-hook-form";

import { FileUpload } from "@/components/file-upload";
import { FormField } from "@/components/form-field";
import { FormRow } from "@/components/form-row";
import SelectServices from "@/components/select-services";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Icon } from "@/components/ui/icon";
import { InfoTooltip } from "@/components/ui/info-icon";
import { LinkInput } from "@/components/ui/link-input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
	SERVICE_PROVIDER_BUDGET_OPTIONS,
	SERVICE_PROVIDER_TIMELINE_OPTIONS,
} from "@/config/consts";
import { FileItem } from "@/features/service-providers/components/file-item";
import { useUpload } from "@/features/service-providers/context/upload-context";

interface CaseStudyItemProps {
	caseStudy: unknown;
	isFirstItem: boolean;
	index: number;
	removeCaseStudy: (index: number) => void;
	register: UseFormRegister<FieldValues>;
	errors: FieldError;
	control: Control<FieldValues>;
}

const CaseStudyItem = ({
	caseStudy,
	isFirstItem,
	index,
	removeCaseStudy,
	register,
	errors,
	control,
}: CaseStudyItemProps) => {
	const { setValue, watch } = useFormContext();
	const { addFile, removeFile, filesToUpload } = useUpload();

	const handleFilesChange = (name: string, newFiles: File[]) => {
		for (const [fileIndex, file] of newFiles.entries()) {
			const fileType = file.type.startsWith("image/") ? "images" : "files";
			const fieldPath = `portfolio.caseStudies.${index}.${fileType}.${fileIndex}`;
			addFile(fieldPath, file);
		}
	};

	const handleDeleteFile = (name: string, fileToDelete: File) => {
		const newFiles = Array.from(filesToUpload.values())
			.filter((file) => file.file !== fileToDelete)
			.map((file) => file.file);

		handleFilesChange(name, newFiles);
		removeFile(name);
	};

	const addMetric = () => {
		const currentMetrics =
			watch(`portfolio.caseStudies.${index}.achievedMetrics`) || [];

		setValue(
			`portfolio.caseStudies.${index}.achievedMetrics`,
			[...currentMetrics, ""],
			{
				shouldValidate: true,
				shouldDirty: true,
			},
		);
	};

	const removeMetric = (metricIndex: number) => {
		const currentMetrics =
			watch(`portfolio.caseStudies.${index}.achievedMetrics`) || [];
		const newMetrics = currentMetrics.filter((_, idx) => idx !== metricIndex);
		setValue(`portfolio.caseStudies.${index}.achievedMetrics`, newMetrics, {
			shouldValidate: true,
			shouldDirty: true,
		});
	};

	const currentFiles = Array.from(filesToUpload.values());
	const filteredFiles = currentFiles
		.filter(({ fieldPath }) =>
			fieldPath.startsWith(`portfolio.caseStudies.${index}`),
		)
		.map((file) => ({
			file: file.file,
			fieldPath: file.fieldPath,
		}));

	return (
		<div className="rounded-lg space-y-6">
			<div className="flex justify-between items-center">
				<Heading as="h3" variants="h5">
					Case Study {index + 1}
				</Heading>
				{!isFirstItem && (
					<Button
						variant="secondary"
						size="md"
						onClick={() => removeCaseStudy(index)}
						className="text-red-500"
					>
						Remove
					</Button>
				)}
			</div>

			<div className="flex flex-col gap-6">
				<FormField
					name={`portfolio.caseStudies.${index}.clientName`}
					label="Client Name"
					register={register}
					error={errors.portfolio?.caseStudies?.[index]?.clientName?.message}
					placeholder="Enter client name"
					required
				/>
				<FormField
					name={`portfolio.caseStudies.${index}.title`}
					label="Project Name"
					register={register}
					error={errors.portfolio?.caseStudies?.[index]?.title?.message}
				/>
				<FormField
					name={`portfolio.caseStudies.${index}.projectUrl`}
					label="Project URL"
					register={register}
					error={errors.portfolio?.caseStudies?.[index]?.projectUrl?.message}
					placeholder="project-url.com"
					required
				>
					<LinkInput prefix="https://" />
				</FormField>
				<FormRow className="md:flex-row flex-col">
					<Controller
						name={`portfolio.caseStudies.${index}.budget`}
						control={control}
						render={({ field }) => (
							<Select
								label="Budget"
								placeholder="Select budget"
								options={SERVICE_PROVIDER_BUDGET_OPTIONS}
								error={errors.portfolio?.caseStudies?.[index]?.budget?.message}
								defaultValue={field.value}
								{...field}
							/>
						)}
					/>

					<Controller
						name={`portfolio.caseStudies.${index}.timeline`}
						control={control}
						render={({ field }) => (
							<Select
								label="Project Timeline"
								placeholder="Select timeline"
								options={SERVICE_PROVIDER_TIMELINE_OPTIONS}
								error={
									errors.portfolio?.caseStudies?.[index]?.timeline?.message
								}
								defaultValue={field.value}
								{...field}
							/>
						)}
					/>
				</FormRow>
			</div>

			<Controller
				name={`portfolio.caseStudies.${index}.description`}
				control={control}
				render={({
					field: { onChange, value, ...field },
					fieldState: { error },
				}) => (
					<Textarea
						{...field}
						value={value || ""}
						onChange={(e) => {
							onChange(e.target.value);
						}}
						id={field.name}
						label="Project Description"
						placeholder="Describe the project and its outcomes..."
						maxLength={1000}
						className="min-h-[120px]"
						error={error?.message}
					/>
				)}
			/>

			<FormField
				name={`portfolio.caseStudies.${index}.serviceCategories`}
				label="Select service categories"
				register={register}
				error={
					errors.portfolio?.caseStudies?.[index]?.serviceCategories?.message
				}
				required
			>
				<Controller
					control={control}
					name={`portfolio.caseStudies.${index}.serviceCategories`}
					render={({ field }) => {
						return (
							<SelectServices
								{...field}
								error={
									errors.portfolio?.caseStudies?.[index]?.serviceCategories
										?.message
								}
								onChange={(value) => {
									field.onChange(value);
								}}
							/>
						);
					}}
				/>
			</FormField>

			<div>
				<div className="text-left mb-4">
					<Heading as="h4" variants="h5">
						Media Upload
					</Heading>
					<Body variants="14-medium" className="text-text-300">
						Add your documents here, you can upload 1 document and up to 5
						images
					</Body>
				</div>
				<div className="flex gap-4">
					<FileUpload
						name={`portfolio.caseStudies.${index}.files`}
						config={{
							images: {
								maxFiles: 5,
								maxSizePerFile: 10000000,
								maxTotalSize: 50000000,
								acceptedTypes: {
									"image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp"],
								},
							},
							documents: {
								maxFiles: 1,
								maxSizePerFile: 100000000,
								maxTotalSize: 100000000,
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
									"text/csv": [".csv"],
									"text/plain": [".txt"],
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
										Images: Up to 5 files (max 10MB each) - JPG, PNG, GIF, WebP{" "}
										<br />
										Documents: 1 file (max 100MB) - PDF, DOC(X), PPT(X)
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
						className="w-full"
						onFilesChange={handleFilesChange}
						currentFiles={filteredFiles.map((file) => file.file)}
					/>
				</div>

				{filteredFiles.length > 0 && (
					<div className="mt-4 space-y-2">
						{filteredFiles.map(({ file, fieldPath }, fileIndex) => {
							return (
								<FileItem
									key={`${file.name}-${fileIndex}-${index}`}
									file={file}
									onDelete={(file) => {
										handleDeleteFile(fieldPath, file);
									}}
								/>
							);
						})}
					</div>
				)}
			</div>

			<div className="space-y-4">
				<div className="flex items-center gap-1">
					<label className="block text-sm font-medium">Achieved Metrics</label>
					<InfoTooltip content="Provide key metrics achieved in this case study. Highlight measurable results that showcase the success of your work (e.g., 'Increased conversion rates by 30%' or 'Achieved 50% growth in organic traffic" />
				</div>

				{(watch(`portfolio.caseStudies.${index}.achievedMetrics`) || []).map(
					(metric: string, metricIndex: number) => (
						// biome-ignore lint/suspicious/noArrayIndexKey:
						<div key={metricIndex} className="relative">
							<Controller
								control={control}
								name={`portfolio.caseStudies.${index}.achievedMetrics.${metricIndex}`}
								defaultValue=""
								render={({ field: { onChange, value, ...field } }) => (
									<Textarea
										{...field}
										value={value || ""}
										onChange={(e) => {
											const newValue = e.target.value;
											onChange(newValue);
											// Update the entire array to ensure proper re-render
											const currentMetrics = [
												...(watch(
													`portfolio.caseStudies.${index}.achievedMetrics`,
												) || []),
											];
											currentMetrics[metricIndex] = newValue;
											setValue(
												`portfolio.caseStudies.${index}.achievedMetrics`,
												currentMetrics,
												{
													shouldValidate: true,
												},
											);
										}}
										placeholder="Describe specific metric or achievement..."
										className="min-h-[120px]"
										maxLength={600}
									/>
								)}
							/>
							<button
								type="button"
								onClick={() => removeMetric(metricIndex)}
								className="absolute top-2 right-2 p-1 hover:text-red-500 transition-colors z-10"
							>
								<Icon name="Trash" className="w-4 h-4" />
							</button>
						</div>
					),
				)}

				<Button
					type="button"
					variant="secondary"
					size="md"
					fullWidth
					onClick={addMetric}
				>
					Add Metric
				</Button>
			</div>
		</div>
	);
};

export default CaseStudyItem;
