import { createHash, randomBytes } from "node:crypto";
import { MAX_PREFIX_LENGTH, MAX_PROVIDER_ID_LENGTH } from "../config/constants";
import type { FileNameOptions } from "../types";

const FILENAME_SALT =
	process.env.FILENAME_SALT || randomBytes(16).toString("hex");

function sanitizeProviderId(providerId?: string): string | undefined {
	if (!providerId) return undefined;

	if (providerId.length > MAX_PROVIDER_ID_LENGTH) {
		throw new Error("Provider ID exceeds maximum length");
	}

	const sanitized = providerId.replace(/[^a-zA-Z0-9-_]/g, "");

	if (sanitized !== providerId) {
		throw new Error("Provider ID contains invalid characters");
	}

	return sanitized;
}

function sanitizePrefix(prefix?: string): string | undefined {
	if (!prefix) return undefined;

	if (prefix.length > MAX_PREFIX_LENGTH) {
		throw new Error("Prefix exceeds maximum length");
	}

	const sanitized = prefix.replace(/[^a-zA-Z0-9-_]/g, "");

	if (sanitized !== prefix) {
		throw new Error("Prefix contains invalid characters");
	}

	return sanitized;
}

function hashProviderId(providerId: string): string {
	return createHash("sha256")
		.update(providerId + FILENAME_SALT)
		.digest("hex")
		.slice(0, 12);
}

export function generateSecureFilename(
	originalFilename: string,
	options: FileNameOptions = {},
): string {
	const sanitizedPrefix = sanitizePrefix(options.prefix);
	const sanitizedProviderId = sanitizeProviderId(options.providerId);
	const extension = originalFilename.split(".").pop()?.toLowerCase();

	if (!extension) {
		throw new Error("Invalid or missing file extension");
	}

	const randomString = randomBytes(16).toString("hex");
	const parts = [
		sanitizedPrefix,
		options.timestamp ? Date.now() : null,
		randomString,
	].filter(Boolean);

	const filename = parts.join("-");
	const suffix = sanitizedProviderId
		? `-${hashProviderId(sanitizedProviderId)}`
		: "";

	return `${filename}${suffix}.${extension}`;
}
