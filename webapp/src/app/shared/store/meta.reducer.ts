import { ActionReducer, MetaReducer } from "@ngrx/store";
import { localStorageSync } from "ngrx-store-localstorage";

export const localStorageSyncReducer = (reducer: ActionReducer<any>): ActionReducer<any> => {
	return localStorageSync({
		keys: [
			{ core: ["authenticationUserState"] },
		],
		rehydrate: true,
	})(reducer);
};

export const metaReducers: MetaReducer<any, any>[] = [localStorageSyncReducer];
