"use client";

import { useEffect, useRef, useState } from "react";
import { match } from "ts-pattern";

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/base-dialog";
import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { DialogHeadingIcon } from "@/components/ui/dialog-heading-icon";
import { Heading } from "@/components/ui/heading";
import AnimatedProgressBar from "@/components/ui/progress-bar";
import { useUpload } from "@/features/service-providers/context/upload-context";
import { uploadFiles } from "@/features/service-providers/services/upload-files";
import { useDialogContext } from "@/providers/dialog-providers";
import { DialogType } from "@/types/dialogs";
import { cn } from "@/utils/cn";

type UploadStatus = "idle" | "uploading" | "completed" | "error" | "preparing";

async function assignUploadedFiles(
	uploads: Array<{ fileKey: string; fieldPath: string }>,
	context: {
		type: "service-provider" | "provider-review";
		id: string | number;
	},
) {
	for (const { fileKey, fieldPath } of uploads) {
		const assignResponse = await fetch("/api/uploads/assign", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				fileKey,
				fieldPath,
				context,
			}),
		});

		if (!assignResponse.ok) {
			throw new Error(`Failed to assign upload: ${assignResponse.statusText}`);
		}
	}
}

const FilesUploadDialog = () => {
	const { isDialogOpen, closeDialog, getDialogData } = useDialogContext();
	const { filesToUpload, clearFiles } = useUpload();
	const [uploadProgress, setUploadProgress] = useState<number>(50);
	const [uploadStatus, setUploadStatus] = useState<UploadStatus>("idle");
	const dialogContentId = "upload-provider-files-content";
	const isUploadingRef = useRef(false);
	const currentUploadIdRef = useRef<string | null>(null);
	const currentFileKeyRef = useRef<string | null>(null);
	const data = getDialogData(DialogType.UPLOAD_PROVIDER_FILES) as {
		context: {
			type: "service-provider" | "provider-review";
			id: string | number;
		};
		handleSuccessUpload: () => void;
	};

	useEffect(() => {
		const handleUpload = async () => {
			if (
				!isDialogOpen(DialogType.UPLOAD_PROVIDER_FILES) ||
				filesToUpload.size === 0 ||
				isUploadingRef.current ||
				!data?.context?.id ||
				!data?.context?.type
			) {
				return;
			}

			isUploadingRef.current = true;

			try {
				setUploadStatus("preparing");
				setUploadProgress(0);

				// Convert FileList to array for easier processing
				const files = Array.from(filesToUpload.entries());
				const totalSize = files.reduce(
					(acc, [_, fileData]) => acc + fileData.file.size,
					0,
				);
				let uploadedSize = 0;

				// Create a Map of files with their metadata
				const filesMap = new Map(
					files.map(([fieldPath, fileData]) => [
						fileData.file.name,
						{
							file: fileData.file,
							filename: fileData.file.name,
							contentType: fileData.file.type,
							size: fileData.file.size,
							fieldPath: fieldPath,
							serviceProviderId: data.context.id,
						},
					]),
				);

				const uploadResults = await uploadFiles(filesMap, {
					onProgress: (progress) => {
						setUploadStatus("uploading");
						const totalProgress =
							((uploadedSize + progress.uploaded) / totalSize) * 100;
						setUploadProgress(totalProgress);
					},
					onError: (error) => {
						console.error("Upload error:", error);
						setUploadStatus("error");
					},
					onFileComplete: (completedSize) => {
						uploadedSize += completedSize;
						setUploadProgress((uploadedSize / totalSize) * 100);
					},
					onUploadStarted: ({ uploadId, fileKey }) => {
						currentUploadIdRef.current = uploadId;
						currentFileKeyRef.current = fileKey;
					},
				});

				// Assign the uploaded files
				await assignUploadedFiles(uploadResults, data.context);

				setUploadStatus("completed");
				clearFiles();

				// Close dialog after success
				setTimeout(() => {
					data.handleSuccessUpload();
				}, 1000);
			} catch (error) {
				console.error("Upload failed:", error);
				setUploadStatus("error");
			} finally {
				isUploadingRef.current = false;
				currentUploadIdRef.current = null;
				currentFileKeyRef.current = null;
			}
		};

		handleUpload();
	}, [isDialogOpen, filesToUpload, clearFiles, data]);

	const getStatusMessage = () => {
		return match(uploadStatus)
			.with("preparing", () => "Preparing files for upload...")
			.with("uploading", () => "Uploading in progress...")
			.with("completed", () => "Upload completed!")
			.with("error", () => "Upload failed. Please try again.")
			.with("idle", () => "Preparing upload...")
			.exhaustive();
	};

	const handleOnClose = () => {
		if (uploadStatus !== "uploading") {
			closeDialog(DialogType.UPLOAD_PROVIDER_FILES);
		}
	};

	const handleRetry = () => {
		isUploadingRef.current = false;
		currentUploadIdRef.current = null;
		currentFileKeyRef.current = null;
		setUploadStatus("idle");
		setUploadProgress(0);
	};

	const handleCancel = async () => {
		if (currentUploadIdRef.current && currentFileKeyRef.current) {
			try {
				const response = await fetch("/api/uploads/abort", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						fileKey: currentFileKeyRef.current,
						uploadId: currentUploadIdRef.current,
					}),
				});

				if (!response.ok) {
					console.error("Failed to abort upload:", response.statusText);
				}
			} catch (error) {
				console.error("Error aborting upload:", error);
			}
		}

		isUploadingRef.current = false;
		currentUploadIdRef.current = null;
		currentFileKeyRef.current = null;
		setUploadStatus("idle");
		setUploadProgress(0);
		clearFiles();
		closeDialog(DialogType.UPLOAD_PROVIDER_FILES);
	};

	return (
		<Dialog
			open={isDialogOpen(DialogType.UPLOAD_PROVIDER_FILES)}
			onOpenChange={handleOnClose}
		>
			<DialogContent aria-describedby={dialogContentId}>
				<div className="flex flex-col items-center justify-center">
					<DialogHeadingIcon iconName="FileUp" className="max-w-48" />
				</div>
				<DialogHeader className="mb-8 w-full">
					<DialogTitle className="text-center mb-6">
						<Heading
							as="h3"
							className="text-lg font-semibold leading-none tracking-tight text-text-100 mb-2"
						>
							Uploading media
						</Heading>
						<Body
							variants="16-medium"
							className={cn(
								uploadStatus === "error" && "text-status-red-100",
								uploadStatus === "uploading" && "text-text-300",
								uploadStatus === "completed" && "text-status-green-100",
							)}
						>
							{getStatusMessage()}
						</Body>
					</DialogTitle>
					<DialogDescription
						id={dialogContentId}
						className="text-text-300 text-base w-full text-center"
					>
						<AnimatedProgressBar progress={uploadProgress} />
					</DialogDescription>
				</DialogHeader>
				<DialogFooter className="w-full mt-auto">
					{uploadStatus === "error" ? (
						<Button variant="primary" size="md" onClick={handleRetry} fullWidth>
							Try again
						</Button>
					) : (
						<Button variant="link" size="sm" onClick={handleCancel} fullWidth>
							Cancel upload
						</Button>
					)}
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
};

export default FilesUploadDialog;
