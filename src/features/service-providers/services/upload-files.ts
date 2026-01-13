type FileToUpload = {
	file: File;
	fieldPath: string;
};

type UploadProgress = {
	uploaded: number;
	total: number;
	percentage: number;
};

type FileUploadData = {
	file: File;
	filename: string;
	contentType: string;
	size: number;
	fieldPath: string;
	serviceProviderId: string;
};

type UploadOptions = {
	onProgress?: (progress: UploadProgress) => void;
	onError?: (error: Error) => void;
	onFileComplete?: (completedSize: number) => void;
	onUploadStarted?: (data: { uploadId: string; fileKey: string }) => void;
};

export class UploadError extends Error {
	constructor(
		message: string,
		public readonly fieldPath?: string,
		public readonly cause?: unknown,
	) {
		super(message);
		this.name = "UploadError";
	}
}

const CHUNK_SIZE = 10 * 1024 * 1024; // 10MB chunks, match with backend

type UploadPart = {
	partNumber: number;
	eTag: string;
};

async function uploadFileChunks(
	file: File,
	fieldPath: string,
	serviceProviderId: string,
	onProgress?: (progress: UploadProgress) => void,
	onUploadStarted?: (data: { uploadId: string; fileKey: string }) => void,
): Promise<{ fileKey: string; uploadId: string }> {
	// Get presigned URLs for chunks
	const response = await fetch("/api/uploads", {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			filename: file.name,
			contentType: file.type,
			size: file.size,
			fieldPath,
			serviceProviderId,
		}),
	});

	if (!response.ok) {
		throw new UploadError(`Failed to get upload URLs: ${response.statusText}`);
	}

	const { urls, fileKey, uploadId } = await response.json();
	let uploadedSize = 0;
	const parts: UploadPart[] = [];

	// Notify when upload starts
	onUploadStarted?.({ uploadId, fileKey });

	try {
		// Upload each chunk
		for (const { url, partNumber } of urls) {
			const start = (partNumber - 1) * CHUNK_SIZE;
			const end = Math.min(start + CHUNK_SIZE, file.size);
			const chunk = file.slice(start, end);

			try {
				const uploadResponse = await fetch(url, {
					method: "PUT",
					body: chunk,
					headers: {
						"Content-Length": chunk.size.toString(),
					},
				});

				if (!uploadResponse.ok) {
					throw new UploadError(
						`Failed to upload chunk ${partNumber}: ${uploadResponse.statusText}`,
						fieldPath,
					);
				}

				const eTag =
					uploadResponse.headers.get("etag") ||
					uploadResponse.headers.get("ETag");

				if (!eTag) {
					throw new UploadError(
						`Missing ETag for chunk ${partNumber}`,
						fieldPath,
					);
				}

				parts.push({
					partNumber,
					eTag: eTag.replace(/['"]/g, ""), // Remove quotes if present
				});

				uploadedSize += chunk.size;
				if (onProgress) {
					onProgress({
						uploaded: uploadedSize,
						total: file.size,
						percentage: Math.round((uploadedSize / file.size) * 100),
					});
				}
			} catch (error) {
				console.error("Error uploading part", error);
			}
		}

		// Complete the multipart upload
		const completionResponse = await fetch("/api/uploads/complete", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				fileKey,
				uploadId,
				parts: parts.sort((a, b) => a.partNumber - b.partNumber),
			}),
		});

		if (!completionResponse.ok) {
			throw new UploadError(
				`Failed to complete upload: ${completionResponse.statusText}`,
				fieldPath,
			);
		}

		return { fileKey, uploadId };
	} catch (error) {
		// Only abort if we actually started the upload
		if (uploadId) {
			try {
				await fetch("/api/uploads/abort", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ fileKey, uploadId }),
				});
			} catch (abortError) {
				console.error("Failed to abort upload:", abortError);
			}
		}
		throw error;
	}
}

export async function uploadFiles(
	filesMap: Map<string, FileUploadData>,
	options?: UploadOptions,
): Promise<Array<{ fileKey: string; fieldPath: string }>> {
	const { onProgress, onError, onFileComplete, onUploadStarted } =
		options ?? {};
	const files = Array.from(filesMap.values());

	try {
		// Upload files sequentially to maintain order and prevent overwhelming the server
		const uploadResults = [];
		for (const fileData of files) {
			const { file, fieldPath, serviceProviderId } = fileData;
			const { fileKey } = await uploadFileChunks(
				file,
				fieldPath,
				serviceProviderId,
				(progress) => {
					onProgress?.(progress);
				},
				onUploadStarted,
			);
			uploadResults.push({ fileKey, fieldPath });
			onFileComplete?.(file.size);
		}
		return uploadResults;
	} catch (error) {
		const uploadError =
			error instanceof UploadError
				? error
				: new UploadError("Upload failed", undefined, error);

		if (onError) {
			onError(uploadError);
		}
		throw uploadError;
	}
}
