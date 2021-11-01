import { Action, createReducer, on } from "@ngrx/store";
import { loginSuccess, logoutSuccess, refreshFailReset, refreshSuccess } from "./authentication.actions";
import { AuthenticationUser } from "../../models/authentication-user.model";

export interface AuthenticationUserState {
	user: AuthenticationUser,
	expiry: number,
}

export const initialUserState: AuthenticationUserState = {
	user: {
		id: "",
		username: "",
		firstName: "",
		lastName: "",
	},
	expiry: 0,
};

const reducer = createReducer(
	initialUserState,

	on(loginSuccess, (state, { user, expiry }) => ({ user, expiry })),

	on(refreshSuccess, (state, { expiry }) => ({ ...state, expiry })),
	on(refreshFailReset, () => initialUserState),

	on(logoutSuccess, () => initialUserState),
);

export function authenticationReducer(state: AuthenticationUserState | undefined, action: Action) {
	return reducer(state, action);
}
