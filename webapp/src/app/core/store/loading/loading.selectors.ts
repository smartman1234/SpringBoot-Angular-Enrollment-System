import { createSelector } from "@ngrx/store";
import { CoreState, selectCoreFeature } from "../index";
import { LoadingState } from "./loading.reducer";

export const selectLoadingState = createSelector(
	selectCoreFeature,
	(state: CoreState) => state.loadingState,
);

export const selectIsLoading = createSelector(
	selectLoadingState,
	(state: LoadingState) => state.isLoading,
);

export const selectTotalRequest = createSelector(
	selectLoadingState,
	(state: LoadingState) => state.totalRequest,
);
