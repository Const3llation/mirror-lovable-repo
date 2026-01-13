import type { CollectionConfig } from "payload";

import {
	isAdmin,
	isInfrastructure,
} from "@/features/auth/api/access/baseAccess";
import { UserRole, UserStatus } from "@/types/user-roles";
import { capitalizeFirstLetter } from "@/utils/strings";

const createUserRoleOptions = (userRoles: UserRole[]) =>
	userRoles.map((role) => ({
		label:
			role === UserRole.SERVICE_PROVIDER
				? "Service Provider"
				: capitalizeFirstLetter(role),
		value: role,
	}));

const createUserStatusOptions = (userStatuses: UserStatus[]) =>
	userStatuses.map((status) => ({
		label: capitalizeFirstLetter(status),
		value: status,
	}));

export const Users: CollectionConfig = {
	slug: "users",
	auth: true,
	admin: {
		useAsTitle: "email",
		hidden: ({ user }) => {
			const req = { user };
			return !isAdmin({ req } as any) && !isInfrastructure({ req } as any);
		},
	},
	fields: [
		{
			name: "name",
			type: "text",
			required: true,
		},
		{
			name: "role",
			type: "select",
			options: createUserRoleOptions(Object.values(UserRole)),
		},
		{
			name: "status",
			type: "select",
			options: createUserStatusOptions(Object.values(UserStatus)),
		},
	],
	timestamps: true,
};
