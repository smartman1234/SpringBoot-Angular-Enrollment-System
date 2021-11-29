import { AdminAuthority } from "../../admin-authority/state/admin-authority.model";

export interface AdminUser {
	id: string,
	username: string,
	password: string,
	enabled: boolean,
	firstName: string,
	lastName: string,
	authorities: Array<AdminAuthority>,
}
