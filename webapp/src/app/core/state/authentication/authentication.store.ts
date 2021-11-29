import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { AuthenticationUser } from "../../models/authentication-user.model";

export interface AuthenticationState {
	user: AuthenticationUser,
	expiry: number,
}

export const initialAuthenticationState = (): AuthenticationState => ({
	user: {
		id: "",
		username: "",
		firstName: "",
		lastName: "",
		authorities: [],
	},
	expiry: 0,
});

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "authentication" })
export class AuthenticationStore extends Store<AuthenticationState> {

	constructor() {
		super(initialAuthenticationState());
	}

}
