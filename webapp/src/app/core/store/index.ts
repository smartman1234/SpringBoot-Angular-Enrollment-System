import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { authenticationReducer, AuthenticationUserState } from "./authentication/authentication.reducer";
import { LoadingReducer, LoadingState } from "./loading/loading.reducer";
import { ErrorLogReducer, ErrorLogState } from "./error-log/error-log.reducer";

export const coreFeatureKey = "core";
export const selectCoreFeature = createFeatureSelector<CoreState>(coreFeatureKey);

export interface CoreState {
	authenticationUserState: AuthenticationUserState,
	loadingState: LoadingState,
	errorLogState: ErrorLogState,
}

export const coreReducers: ActionReducerMap<CoreState> = {
	authenticationUserState: authenticationReducer,
	loadingState: LoadingReducer,
	errorLogState: ErrorLogReducer,
};
