import { createAction, props } from "@ngrx/store";
import { AuthenticationUser } from "../../models/authentication-user.model";

export const login = createAction(
	"[Authentication] Login",
	props<{ username: string, password: string }>(),
);
export const loginSuccess = createAction(
	"[Authentication] Login Success",
	props<{ user: AuthenticationUser, expiry: number }>(),
);
export const loginFail = createAction("[Authentication] Login Fail");

export const refresh = createAction("[Authentication] Refresh");
export const refreshSuccess = createAction(
	"[Authentication] Refresh Success",
	props<{ expiry: number }>(),
);
export const refreshFail = createAction("[Authentication] Refresh Fail");
export const refreshFailReset = createAction("[Authentication] Refresh Fail Reset");


export const logout = createAction("[Authentication] Logout");
export const logoutSuccess = createAction("[Authentication] Logout Success");
export const logoutFail = createAction("[Authentication] Logout Fail");
