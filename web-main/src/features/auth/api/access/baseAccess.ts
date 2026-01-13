import type { Access } from "payload";

import { UserRole } from "@/types/user-roles";

// TODO: depending on our needs we can have
//   - isActive
//   - isOwnerOrAdmin

export const isAdmin: Access = ({ req: { user } }) => {
	if (!user) return false;

	return user.role === UserRole.ADMIN;
};

export const isInfrastructure: Access = ({ req: { user } }) => {
	if (!user) return false;

	return user.role === UserRole.INFRASTRUCTURE;
};

export const isEditor: Access = ({ req: { user } }) => {
	if (!user) return false;

	return user.role === UserRole.EDITOR;
};

export const isClient: Access = ({ req: { user } }) => {
	if (!user) return false;

	return user.role === UserRole.CLIENT;
};

export const isServiceProvider: Access = ({ req: { user } }) => {
	if (!user) return false;

	return user.role === UserRole.SERVICE_PROVIDER;
};

export const isOwner: Access = ({ req: { user }, id }) => {
	if (!user || !id) return false;

	return {
		id: {
			equals: user.id,
		},
	};
};
