import {
	ALLOWED_FILE_TYPES,
	MAX_FILE_SIZE,
} from "@/features/file-uploads/config/constants";
import type {
	AllowedFileType,
	FileTypeRules,
	FileValidationRules,
} from "@/features/file-uploads/types";

// File signatures for supported file types
const FILE_SIGNATURES: Record<string, number[][]> = {
	"image/jpg": [[0xff, 0xd8, 0xff]],
	"image/jpeg": [[0xff, 0xd8, 0xff]],
	"image/png": [[0x89, 0x50, 0x4e, 0x47]],
	"image/webp": [[0x52, 0x49, 0x46, 0x46]],
	"application/pdf": [[0x25, 0x50, 0x44, 0x46]],
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document": [
		[0x50, 0x4b, 0x03, 0x04],
	],
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
		[0x50, 0x4b, 0x03, 0x04],
	],
	"application/vnd.openxmlformats-officedocument.presentationml.presentation": [
		[0x50, 0x4b, 0x03, 0x04],
	],
	"application/msword": [[0xd0, 0xcf, 0x11, 0xe0]],
	"application/vnd.ms-excel": [[0xd0, 0xcf, 0x11, 0xe0]],
	"application/vnd.ms-powerpoint": [[0xd0, 0xcf, 0x11, 0xe0]],
	"text/plain": [],
	"text/markdown": [],
};

const ALLOWED_EXTENSIONS: Record<string, FileTypeRules> =
	ALLOWED_FILE_TYPES.reduce<Record<string, FileTypeRules>>((acc, mimeType) => {
		const extension = mimeType.split("/")[1] ?? "unknown";
		acc[extension] = {
			maxSize: MAX_FILE_SIZE,
			mimeTypes: [mimeType],
		};
		return acc;
	}, {});

// Special case for markdown
ALLOWED_EXTENSIONS.md = {
	maxSize: MAX_FILE_SIZE,
	mimeTypes: ["text/markdown", "text/plain"],
};

export async function validateFileUpload(file: File): Promise<string | null> {
	if (file.size > MAX_FILE_SIZE) {
		return "File size exceeds 10MB limit";
	}

	if (!ALLOWED_FILE_TYPES.includes(file.type as AllowedFileType)) {
		return "Invalid file type. Allowed types: images, PDF, Excel, Word, text, markdown, and presentations";
	}

	if (file.type === "text/plain" || file.type === "text/markdown") {
		return null;
	}

	try {
		const validSignature = await validateFileSignature(file);
		if (!validSignature) {
			return "Invalid file format";
		}
	} catch (error) {
		console.error("File signature validation error:", error);
		return "File validation failed";
	}

	return null;
}

async function validateFileSignature(file: File): Promise<boolean> {
	const expectedSignatures = FILE_SIGNATURES[file.type];
	if (!expectedSignatures) return false;

	const buffer = await file.slice(0, 4).arrayBuffer();
	const header = new Uint8Array(buffer);

	return expectedSignatures.some((signature) =>
		signature.every((byte, index) => header[index] === byte),
	);
}

export function validateFileExtension(filename: string): boolean {
	const extension = filename.split(".").pop()?.toLowerCase();
	return extension ? extension in ALLOWED_EXTENSIONS : false;
}

export function getFileValidationRules(filename: string): FileValidationRules {
	const extension = filename.split(".").pop()?.toLowerCase();

	if (!extension || !(extension in ALLOWED_EXTENSIONS)) {
		return { isValid: false, maxSize: 0, allowedMimeTypes: [] };
	}

	const rules = ALLOWED_EXTENSIONS[extension];
	return {
		isValid: true,
		maxSize: rules.maxSize,
		allowedMimeTypes: rules.mimeTypes,
	};
}

export function isImageUpload(mimeType: string): boolean {
	return mimeType.startsWith("image/");
}
