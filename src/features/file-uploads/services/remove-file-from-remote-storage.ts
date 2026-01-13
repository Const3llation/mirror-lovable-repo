const removeFileFromRemoteStorage = async (remoteURL: string) => {
	try {
		const response = await fetch(
			`${process.env.NEXT_PUBLIC_CMS_URL}/api/uploads/delete`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ key: remoteURL }),
			},
		);

		if (!response.ok) {
			const error = await response.json();
			throw new Error(
				error.message || "Failed to delete file from remote storage",
			);
		}

		return await response.json();
	} catch (error) {
		console.error("Error removing file from remote storage:", error);
		throw error;
	}
};

export default removeFileFromRemoteStorage;
