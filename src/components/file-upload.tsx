"use client";

import { Icon, type IconName } from "@/components/ui/icon";
import IconBadge from "@/components/ui/icon-badge";
import { cn } from "@/utils/cn";
import { type ReactNode, useRef } from "react";
import { type Accept, useDropzone } from "react-dropzone";

/* ============================================================================
   TYPES & CONFIG
   ========================================================================= */

// These file types remain unchanged
export type FileUploadType = "images" | "documents";

// Legacy configuration (per type)
export interface LegacyFileUploadConfig {
	maxFiles: number | null;
	maxSizePerFile: number | null;
	maxTotalSize: number;
	acceptedTypes: Accept;
}
export type LegacyConfig = Partial<
	Record<FileUploadType, LegacyFileUploadConfig>
>;

// New “global” configuration (global limits with per‐file limits defined inside each type)
export interface GlobalFileUploadConfig {
	maxFiles: number;
	maxTotalSize: number;
	images?: {
		maxSizePerFile: number;
		acceptedTypes: Accept;
	};
	documents?: {
		maxSizePerFile: number;
		acceptedTypes: Accept;
	};
}

export type FileUploadConfiguration = GlobalFileUploadConfig | LegacyConfig;

function isGlobalConfig(
	config: FileUploadConfiguration,
): config is GlobalFileUploadConfig {
	return "maxFiles" in config && "maxTotalSize" in config;
}

export type RemoteFile = {
	relationTo: string;
	value: {
		id: number;
		type: string;
		remoteURL: string;
	};
};

export type FileOrRemote = File | RemoteFile;

export const getFileType = (file: FileOrRemote): FileUploadType => {
	if (file instanceof File) {
		return file.type.startsWith("image/") ? "images" : "documents";
	}
	// For remote files, check the type field or derive from remoteURL
	return file.value.type === "image" ? "images" : "documents";
};

// Returns the total file size (only counting local File objects)
const getCurrentTotalSize = (
	files: FileOrRemote[],
	fileType?: FileUploadType,
): number => {
	return files.reduce((total, file) => {
		// Only count size for local Files; remote files don’t count toward the limit
		if (file instanceof File && (!fileType || getFileType(file) === fileType)) {
			return total + file.size;
		}
		return total;
	}, 0);
};

/**
 * Returns an “upload configuration” for Dropzone. In the legacy case the acceptedTypes
 * are combined from images and documents and the per‑type limits are “summed.”
 *
 * In the new global config the top‑level keys are used.
 */
const getUploadConfig = (config: FileUploadConfiguration) => {
	if (isGlobalConfig(config)) {
		const acceptedTypes = {
			...(config.images?.acceptedTypes ?? {}),
			...(config.documents?.acceptedTypes ?? {}),
		};
		return {
			acceptedTypes,
			maxFiles: config.maxFiles,
			maxTotalSize: config.maxTotalSize,
		};
	}

	const { images, documents } = config;
	const acceptedTypes = {
		...(images?.acceptedTypes ?? {}),
		...(documents?.acceptedTypes ?? {}),
	};
	const imagesMaxFiles = images?.maxFiles ?? 0;
	const imagesMaxTotalSize = images?.maxTotalSize ?? 0;
	const documentsMaxFiles = documents?.maxFiles ?? 0;
	const documentsMaxTotalSize = documents?.maxTotalSize ?? 0;
	return {
		acceptedTypes,
		maxFiles: imagesMaxFiles + documentsMaxFiles,
		maxTotalSize: imagesMaxTotalSize + documentsMaxTotalSize,
	};
};

/**
 * Compute per‑type stats from the current files.
 * For global config the per‑type limits are not defined so they are left undefined.
 */
const getFileUploadStats = (
	currentFiles: FileOrRemote[],
	config: FileUploadConfiguration,
	errors: Record<FileUploadType, string | null>,
) => {
	const imagesCount = currentFiles.filter(
		(file) => getFileType(file) === "images",
	).length;
	const documentsCount = currentFiles.filter(
		(file) => getFileType(file) === "documents",
	).length;

	let maxFilesImages = undefined;
	let maxFilesDocuments = undefined;
	if (!isGlobalConfig(config)) {
		maxFilesImages = config.images?.maxFiles;
		maxFilesDocuments = config.documents?.maxFiles;
	}

	return {
		images: {
			maxFiles: maxFilesImages,
			count: imagesCount,
			error: errors.images,
		},
		documents: {
			maxFiles: maxFilesDocuments,
			count: documentsCount,
			error: errors.documents,
		},
	};
};

type FileUploadProps = {
	name: string;
	label: (stats: ReturnType<typeof getFileUploadStats>) => string | ReactNode;
	iconName?: IconName;
	className?: string;
	onFilesChange?: (name: string, newFiles: FileOrRemote[]) => void;
	currentFiles?: FileOrRemote[];
	config: FileUploadConfiguration;
};

/* ============================================================================
   LEGACY VALIDATION HELPERS
   ========================================================================= */

/** For the legacy config, count per file type. */
const checkAcceptedFileCountLimits = (
	acceptedFiles: FileOrRemote[],
	config: LegacyConfig,
) => {
	const imagesCount = acceptedFiles.filter(
		(file) => getFileType(file) === "images",
	).length;
	const documentsCount = acceptedFiles.filter(
		(file) => getFileType(file) === "documents",
	).length;

	const isImagesCountExceeded =
		config.images?.maxFiles != null && imagesCount > config.images.maxFiles;
	const isDocumentsCountExceeded =
		config.documents?.maxFiles != null &&
		documentsCount > config.documents.maxFiles;

	return {
		isImagesCountExceeded,
		isDocumentsCountExceeded,
	};
};

/** For the legacy config, check that the sum of file sizes does not exceed per‑type limits. */
const checkAcceptedFileSizeLimits = (
	acceptedFiles: FileOrRemote[],
	config: LegacyConfig,
) => {
	const acceptedImages = acceptedFiles.filter(
		(file) => getFileType(file) === "images",
	);
	const acceptedDocuments = acceptedFiles.filter(
		(file) => getFileType(file) === "documents",
	);

	const isImagesSizeExceeded =
		config.images?.maxTotalSize != null &&
		getCurrentTotalSize(acceptedImages, "images") > config.images.maxTotalSize;
	const isDocumentsSizeExceeded =
		config.documents?.maxTotalSize != null &&
		getCurrentTotalSize(acceptedDocuments, "documents") >
			config.documents.maxTotalSize;

	return {
		isImagesSizeExceeded,
		isDocumentsSizeExceeded,
	};
};

/* ============================================================================
   COMPONENT
   ========================================================================= */

export function FileUpload({
	name,
	label,
	iconName,
	className,
	onFilesChange,
	currentFiles = [],
	config,
}: FileUploadProps) {
	// We use a simple error object with separate keys for images and documents.
	const errors = useRef<Record<FileUploadType, string | null>>({
		images: null,
		documents: null,
	});

	const uploadConfig = getUploadConfig(config);

	// Compute a per‐file maximum size to pass to Dropzone.
	// (We choose the highest per‑file limit among the types.)
	const perFileMaxSizeImages =
		isGlobalConfig(config) && config.images?.maxSizePerFile
			? config.images.maxSizePerFile
			: !isGlobalConfig(config) && config.images?.maxSizePerFile
				? config.images.maxSizePerFile
				: 0;
	const perFileMaxSizeDocuments =
		isGlobalConfig(config) && config.documents?.maxSizePerFile
			? config.documents.maxSizePerFile
			: !isGlobalConfig(config) && config.documents?.maxSizePerFile
				? config.documents.maxSizePerFile
				: 0;
	const dropzoneMaxSize = Math.max(
		perFileMaxSizeImages,
		perFileMaxSizeDocuments,
	);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		accept: uploadConfig.acceptedTypes,
		// Only set Dropzone’s maxSize if there is a per‑file limit.
		...(dropzoneMaxSize > 0 ? { maxSize: dropzoneMaxSize } : {}),
		onDrop: (acceptedFiles) => {
			let validFiles: FileOrRemote[] = [];

			// --- GLOBAL CONFIG CASE ---
			if (isGlobalConfig(config)) {
				const allFiles = [...currentFiles, ...acceptedFiles] as FileOrRemote[];
				// Count only local files (ignore remote files for file count/size limits)
				const localFiles = allFiles.filter((file) => file instanceof File);
				if (localFiles.length > config.maxFiles) {
					const errorMsg = `Maximum of ${config.maxFiles} files allowed`;
					errors.current = { images: errorMsg, documents: errorMsg };
				} else if (getCurrentTotalSize(allFiles) > config.maxTotalSize) {
					const errorMsg = `Maximum total file size of ${config.maxTotalSize} bytes exceeded`;
					errors.current = { images: errorMsg, documents: errorMsg };
				} else {
					// For each new file, also check that it does not exceed its per‑file limit.
					validFiles = acceptedFiles.filter((file) => {
						if (file instanceof File) {
							const fileType = getFileType(file);
							if (
								fileType === "images" &&
								config.images?.maxSizePerFile &&
								file.size > config.images.maxSizePerFile
							) {
								errors.current.images = `Each image must be less than ${config.images.maxSizePerFile} bytes`;
								return false;
							}
							if (
								fileType === "documents" &&
								config.documents?.maxSizePerFile &&
								file.size > config.documents.maxSizePerFile
							) {
								errors.current.documents = `Each document must be less than ${config.documents.maxSizePerFile} bytes`;
								return false;
							}
						}
						// Clear errors if this file is okay.
						errors.current = { images: null, documents: null };
						return true;
					});
				}
			} else {
				// --- LEGACY CONFIG CASE ---
				const allFiles = [...currentFiles, ...acceptedFiles] as FileOrRemote[];
				const { isImagesCountExceeded, isDocumentsCountExceeded } =
					checkAcceptedFileCountLimits(allFiles, config);
				const { isImagesSizeExceeded, isDocumentsSizeExceeded } =
					checkAcceptedFileSizeLimits(allFiles, config);

				validFiles = acceptedFiles.filter((file) => {
					const fileType = getFileType(file);
					if (
						fileType === "images" &&
						(isImagesCountExceeded || isImagesSizeExceeded)
					) {
						errors.current.images =
							"Images: Maximum files or total size exceeded";
						return false;
					}
					if (
						fileType === "documents" &&
						(isDocumentsCountExceeded || isDocumentsSizeExceeded)
					) {
						errors.current.documents =
							"Documents: Maximum files or total size exceeded";
						return false;
					}
					errors.current = { images: null, documents: null };
					return true;
				});
			}

			onFilesChange?.(name, [...currentFiles, ...validFiles]);
		},
	});

	const stats = getFileUploadStats(currentFiles, config, errors.current);

	return (
		<div
			{...getRootProps()}
			className={cn(
				`border border-dashed rounded-lg py-6 px-4 text-center cursor-pointer transition-colors bg-background-input
        ${
					isDragActive
						? "border-primary-100 bg-primary-100/10"
						: "border-stroke-25 hover:border-primary-100"
				}`,
				className,
			)}
		>
			<input {...getInputProps()} />
			{iconName && (
				<div className="flex justify-center mb-4">
					<IconBadge size="lg">
						<Icon name={iconName} width={21} height={21} />
					</IconBadge>
				</div>
			)}

			<div>
				{typeof label === "string" ? (
					<p className="text-sm font-medium">{label}</p>
				) : (
					label(stats)
				)}
			</div>
		</div>
	);
}
