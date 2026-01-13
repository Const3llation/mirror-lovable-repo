import type { Access } from "payload";

export interface AccessController {
	create: Access;
	read: Access;
	update: Access;
	delete: Access;
	admin: Access;
}
