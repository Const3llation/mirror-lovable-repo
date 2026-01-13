// features/service-providers/context/upload-context.tsx
import { createContext, useContext, useState } from "react";

type FileUpload = {
	file: File;
	fieldPath: string; // Path in the form data where the URL should be stored
};

interface UploadContextType {
	filesToUpload: Map<string, FileUpload>;
	addFile: (fieldPath: string, file: File) => void;
	removeFile: (fieldPath: string) => void;
	clearFiles: () => void;
}

const UploadContext = createContext<UploadContextType | null>(null);

export function UploadProvider({ children }: { children: React.ReactNode }) {
	const [filesToUpload, setFilesToUpload] = useState<Map<string, FileUpload>>(
		new Map(),
	);

	const addFile = (fieldPath: string, file: File) => {
		setFilesToUpload(
			new Map(filesToUpload.set(fieldPath, { file, fieldPath })),
		);
	};

	const removeFile = (fieldPath: string) => {
		const newFiles = new Map(filesToUpload);
		newFiles.delete(fieldPath);
		setFilesToUpload(newFiles);
	};

	const clearFiles = () => {
		setFilesToUpload(new Map());
	};

	return (
		<UploadContext.Provider
			value={{ filesToUpload, addFile, removeFile, clearFiles }}
		>
			{children}
		</UploadContext.Provider>
	);
}

export const useUpload = () => {
	const context = useContext(UploadContext);
	if (!context) {
		throw new Error("useUpload must be used within an UploadProvider");
	}
	return context;
};
