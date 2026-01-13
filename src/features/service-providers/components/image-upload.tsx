import { Body } from "@/components/ui/body";
import { Button } from "@/components/ui/button";
import { validateFileExtension } from "@/features/file-uploads/services/file-validation";
import { cn } from "@/utils/cn";
import { validateImageDimensions } from "@/utils/image";
import { Image as ImageIcon, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useUpload } from "../context/upload-context";

type ImageUploadProps = {
	defaultImageUrl: string | null;
	fieldPath: string;
	onChange: (file: File | null) => void;
	value?: File | null;
	error?: { message?: string } | string;
	className?: string;
	title?: string;
	description?: string;
	rounded?: boolean;
	minWidth?: number;
	minHeight?: number;
	aspectRatio?: number;
	aspectRatioTolerance?: number;
	maxFileSize?: number;
};

const ImageUpload = ({
	fieldPath,
	onChange,
	value,
	error,
	className,
	title = "Select image",
	description = "Minimum 200x200px. Image should be well-centered with proper aspect ratio. Max 5MB.(JPEG,PNG,WEBP)",
	rounded = false,
	minWidth = 200,
	minHeight = 200,
	aspectRatio = 1,
	aspectRatioTolerance = 0.1,
	maxFileSize = 5 * 1024 * 1024,
	defaultImageUrl,
}: ImageUploadProps) => {
	const { addFile, removeFile } = useUpload();
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [validationError, setValidationError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	// Create or update preview URL when value changes
	useEffect(() => {
		if (value instanceof File) {
			const url = URL.createObjectURL(value);
			setPreviewUrl(url);
			return () => URL.revokeObjectURL(url);
		}

		setPreviewUrl(defaultImageUrl ?? null);
	}, [value, defaultImageUrl]);

	const validateFile = async (file: File): Promise<boolean> => {
		setValidationError(null);

		if (file.size > maxFileSize) {
			setValidationError(
				`File size must be less than ${maxFileSize / (1024 * 1024)}MB`,
			);
			return false;
		}

		if (!validateFileExtension(file.name)) {
			setValidationError(
				"Please upload a valid image file (JPEG, PNG, or WEBP)",
			);
			return false;
		}

		try {
			const dimensions = await validateImageDimensions(file);

			if (dimensions.width < minWidth || dimensions.height < minHeight) {
				setValidationError(`Image must be at least ${minWidth}x${minHeight}px`);
				return false;
			}

			const actualRatio = dimensions.width / dimensions.height;
			const minRatio = aspectRatio * (1 - aspectRatioTolerance);
			const maxRatio = aspectRatio * (1 + aspectRatioTolerance);

			if (actualRatio < minRatio || actualRatio > maxRatio) {
				const expectedRatio =
					aspectRatio === 1 ? "square (1:1)" : `${aspectRatio}:1`;
				setValidationError(
					`Image aspect ratio should be approximately ${expectedRatio}. Please crop your image appropriately.`,
				);
				return false;
			}

			return true;
		} catch (error) {
			console.error("Error validating image:", error);
			setValidationError("Failed to validate image dimensions");
			return false;
		}
	};

	const handleFileSelect = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		try {
			const isValid = await validateFile(file);
			if (!isValid) {
				if (fileInputRef.current) {
					fileInputRef.current.value = "";
				}
				return;
			}

			addFile(fieldPath, file);
			onChange(file);
		} catch (error) {
			console.error("Error handling file selection:", error);
			setValidationError("Failed to process image");
		}
	};

	const handleRemove = () => {
		setValidationError(null);
		removeFile(fieldPath);
		onChange(null);

		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};

	const triggerFileInput = () => {
		fileInputRef.current?.click();
	};

	const hasError = !!error || !!validationError;
	const errorMessage =
		typeof error === "string" ? error : error?.message || validationError;
	const errorId = `${fieldPath}-error`;

	return (
		<div className={cn("w-full group relative", className)}>
			<div className="absolute -inset-[2px] rounded-lg pointer-events-none opacity-0 group-focus-within:opacity-100 ring-2 ring-white z-0" />
			<div
				className={cn(
					"relative z-10",
					"bg-background-input border border-stroke-25 rounded-lg",
					"flex flex-col md:flex-row p-6 gap-6",
					hasError ? "border-red-500" : "border-stroke-25",
				)}
				aria-invalid={hasError ? "true" : "false"}
				aria-describedby={hasError ? errorId : undefined}
			>
				<div
					className={cn(
						"w-40 h-40 relative bg-background-100 rounded-lg flex items-center justify-center",
						"mx-auto md:mx-0",
						rounded && "rounded-full",
					)}
				>
					{previewUrl ? (
						<>
							<img
								src={previewUrl}
								alt="Preview"
								className={cn(
									"w-full h-full object-cover",
									rounded ? "rounded-full" : "rounded-lg",
								)}
							/>
							<button
								onClick={handleRemove}
								className={cn(
									"absolute top-2 right-2 p-1.5",
									"bg-background-input border border-stroke-25 rounded-full",
									"text-text-100 hover:text-text-50",
									"transition-colors",
								)}
								type="button"
								aria-label="Remove image"
							>
								<X className="w-4 h-4" />
							</button>
						</>
					) : (
						<ImageIcon className="w-8 h-8 text-text-300" />
					)}
				</div>

				<div className="flex flex-col justify-between flex-1 gap-6">
					<div className="gap-2 text-center md:text-left">
						<Body variants="14-medium" className="text-text-100">
							{title}
						</Body>
						<Body
							variants="14-regular"
							className="text-text-300 sm:max-w-[70%] mx-auto md:mx-0 md:max-w-none"
						>
							{description}
						</Body>
					</div>

					<div className="flex justify-center md:justify-start">
						<input
							ref={fileInputRef}
							type="file"
							className="hidden"
							accept="image/jpeg,image/png,image/webp"
							onChange={handleFileSelect}
							aria-label="Select image"
						/>
						<Button
							variant="primary"
							size="md"
							onClick={triggerFileInput}
							type="button"
							className="w-full sm:w-auto"
						>
							Select image
						</Button>
					</div>
				</div>
			</div>
			{hasError && (
				<p
					id={errorId}
					className="mt-1 text-sm text-red-500 formFieldError"
					role="alert"
				>
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default ImageUpload;
