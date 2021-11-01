import { Action, createReducer, on } from "@ngrx/store";
import {
	decreaseRequest,
	increaseRequest,
	loadingOff,
	loadingOn,
} from "./loading.actions";

export interface LoadingState {
	isLoading: boolean,
	totalRequest: number,
}

export const initialLoadingState: LoadingState = {
	isLoading: false,
	totalRequest: 0,
};

const reducer = createReducer(
	initialLoadingState,
	on(loadingOn, (state) => ({ ...state, isLoading: true })),
	on(loadingOff, (state) => ({ ...state, isLoading: state.totalRequest > 0 })),

	on(increaseRequest, (state) => ({
		...state,
		totalRequest: state.totalRequest + 1,
	})),
	on(decreaseRequest, (state) => ({
		...state,
		totalRequest: state.totalRequest > 0 ? state.totalRequest - 1 : 0,
	})),
);

export function LoadingReducer(state: LoadingState | undefined, action: Action) {
	return reducer(state, action);
}


