export enum UserRole {
	// Admin roles
	INFRASTRUCTURE = "infrastructure", // Roles that sees some additional collections necessary for debugging eg. search index
	ADMIN = "admin",
	EDITOR = "editor",

	// Regular user roles
	CLIENT = "client",
	SERVICE_PROVIDER = "service_provider",
}

export enum UserStatus {
	PENDING = "pending",
	ACTIVE = "active",
	SUSPENDED = "suspended",
	DELETED = "deleted",
}
