import { createSelector } from "@ngrx/store";
import { AuthenticationUserState } from "./authentication.reducer";
import { AuthenticationUser } from "../../models/authentication-user.model";
import { CoreState, selectCoreFeature } from "../index";

export const selectAuthenticationUserState = createSelector(
	selectCoreFeature,
	(state: CoreState) => state.authenticationUserState,
);
export const selectAuthenticationUser = createSelector(
	selectAuthenticationUserState,
	(state: AuthenticationUserState) => state.user,
);
export const selectUserId = createSelector(
	selectAuthenticationUser,
	(user: AuthenticationUser) => user.id,
);
export const selectExpiry = createSelector(
	selectAuthenticationUserState,
	(state: AuthenticationUserState) => state.expiry,
);
export const selectAuthorities = createSelector(
	selectAuthenticationUserState,
	(state: AuthenticationUserState) => state.user.authorities,
);


