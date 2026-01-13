const stringToSlug = (str: string) => {
	return str
		.toLowerCase()
		.replace(/[^a-zA-Z0-9]/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
};

export default stringToSlug;
