import type { Access } from "payload";
import { isAdmin } from "./baseAccess";
import type { AccessController } from "./types";

interface CreateCollectionAccessOptions {
	isPublic?: boolean;
	adminOnly?: boolean;

	customRead?: Access;
	customCreate?: Access;
	customUpdate?: Access;
	customDelete?: Access;

	editorCanCreate?: boolean;
	editorCanUpdate?: boolean;
	editorCanDelete?: boolean;
}

// TODO: implement editor access that goes well with admin access
export const createCollectionAccess = (
	options: CreateCollectionAccessOptions = {},
): AccessController => {
	const {
		isPublic = false,
		adminOnly = true,
		customRead,
		customCreate,
		customUpdate,
		customDelete,
		editorCanCreate = true,
		editorCanUpdate = true,
		editorCanDelete = true,
	} = options;

	// For MVP, only admins can perform CRUD operations
	return {
		// Only admins can create by default
		create: customCreate || isAdmin,

		// Public read access if specified, otherwise admin-only
		read: customRead || (isPublic ? () => true : isAdmin),

		// Only admins can update by default
		update: customUpdate || isAdmin,

		// Only admins can delete by default
		delete: customDelete || isAdmin,

		// Only admins can access admin panel
		admin: isAdmin,
	};
};
