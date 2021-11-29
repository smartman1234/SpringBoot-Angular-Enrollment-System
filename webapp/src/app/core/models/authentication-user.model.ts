import { Authority } from "./authority.model";

export interface AuthenticationUser {
	id: string,
	username: string,
	firstName: string,
	lastName: string,
	authorities: Array<Authority>,
}
