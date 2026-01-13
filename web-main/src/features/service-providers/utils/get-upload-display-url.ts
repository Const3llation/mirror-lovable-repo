import type { ImageUpload, RemoteFileUpload } from "@/types/payload";

/**
 * Returns the display URL for a logo.
 * If the logo is a File, it returns a URL.createObjectURL for the file.
 * Otherwise, it returns the logo URL.
 *
 * @param logo - The logo to get the display URL for.
 * @returns The display URL for the logo.
 */
const getUploadDisplayUrl = (
	logo:
		| ({
				relationTo: "image-uploads";
				value: number | ImageUpload;
		  } | null)
		| ({
				relationTo: "remote-file-uploads";
				value: number | RemoteFileUpload;
		  } | null)
		| File,
) => {
	if (typeof window !== "undefined" && logo instanceof File) {
		return URL.createObjectURL(logo);
	}

	if (!logo || typeof logo !== "object" || !("relationTo" in logo)) {
		return null;
	}

	if (logo.relationTo === "image-uploads" && typeof logo.value === "object") {
		return `${process.env.NEXT_PUBLIC_FILES_STORAGE_URL}/${logo.value.filename}`;
	}

	if (
		logo.relationTo === "remote-file-uploads" &&
		typeof logo.value === "object"
	) {
		return logo.value.remoteURL;
	}

	return null;
};

export default getUploadDisplayUrl;
