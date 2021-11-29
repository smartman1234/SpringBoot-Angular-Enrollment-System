import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { AuthenticationState, AuthenticationStore } from "./authentication.store";

@Injectable({ providedIn: "root" })
export class AuthenticationQuery extends Query<AuthenticationState> {

	user$ = this.select(state => state.user);
	expiry$ = this.select(state => state.expiry);
	id$ = this.select(state => state.user.id);
	authorities$ = this.select(state => state.user.authorities);

	constructor(protected store: AuthenticationStore) {
		super(store);
	}

}
