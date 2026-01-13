import type { ALLOWED_FILE_TYPES } from "@/features/file-uploads/config/constants";

export interface FileNameOptions {
	prefix?: string;
	timestamp?: boolean;
	providerId?: string;
}

export interface UploadResponse {
	url: string;
	filename: string;
	mimeType: string;
	filesize: number;
	width?: number;
	height?: number;
	fieldPath: string;
	id: string;
	serviceProvider: string;
}

export interface FileTypeRules {
	maxSize: number;
	mimeTypes: string[];
}

export interface FileValidationRules {
	isValid: boolean;
	maxSize: number;
	allowedMimeTypes: string[];
}

export type AllowedFileType = (typeof ALLOWED_FILE_TYPES)[number];

export type FileSignatures = Record<string, number[][]>;
