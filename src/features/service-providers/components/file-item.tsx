import { Body } from "@/components/ui/body";
import { Icon } from "@/components/ui/icon";

interface FileItemProps {
	file: File;
	onDelete: (file: File) => void;
}

const formatFileSize = (size: number) => {
	if (size < 1024 * 1024) {
		return `${(size / 1024).toFixed(2)} KB`;
	}
	return `${(size / (1024 * 1024)).toFixed(2)} MB`;
};

export const FileItem = ({ file, onDelete }: FileItemProps) => {
	if (!file) return null;
	const isImage = file.type?.startsWith("image/") ?? false;

	return (
		<div className="flex items-center justify-between p-3 bg-background-secondary rounded-lg border border-stroke-25">
			<div className="flex items-center gap-3">
				<Icon
					name={isImage ? "Image" : "Pdf"}
					className="text-primary-100"
					width={30}
					height={30}
				/>
				<div className="flex flex-col text-left">
					<Body variants="16-medium" className="text-text-100">
						{file.name}
					</Body>
					<Body variants="14-medium" className="text-text-300">
						{formatFileSize(file.size)}
					</Body>
				</div>
			</div>
			<button
				type="button"
				onClick={() => onDelete(file)}
				className="text-white hover:text-red-400 transition-colors"
			>
				<Icon name="Trash" className="w-5 h-5" />
			</button>
		</div>
	);
};
