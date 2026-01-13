import auditLogPlugin from "@rumess/payload-audit-log";

export const auditLogs = auditLogPlugin({
	collections: [
		"service-providers",
		"categories",
		"sub-categories",
		"reviews",
		"users",
		"image-uploads",
		"file-uploads",
	],
	includeAuth: true,
});
