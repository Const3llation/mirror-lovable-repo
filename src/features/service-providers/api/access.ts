import { createCollectionAccess } from "@/features/auth/api/access/createCollectionAccess";

export const serviceProviderAccess = createCollectionAccess({
	isPublic: true,
	adminOnly: true,
	editorCanCreate: true,
	editorCanUpdate: true,
	editorCanDelete: true,
});
