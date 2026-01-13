export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit
export const UPLOAD_TIMEOUT = 60000; // 60 seconds
export const MAX_PROVIDER_ID_LENGTH = 64;
export const MAX_PREFIX_LENGTH = 32;

export const ALLOWED_FILE_TYPES = [
	// Images
	"image/jpeg",
	"image/jpg",
	"image/png",
	"image/webp",
	// Documents
	"application/pdf",
	// Excel
	"application/vnd.ms-excel",
	"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
	// Word
	"application/msword",
	"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
	// Text & Markdown
	"text/plain",
	"text/markdown",
	// Presentations
	"application/vnd.ms-powerpoint",
	"application/vnd.openxmlformats-officedocument.presentationml.presentation",
] as const;
