import { createSelector } from "@ngrx/store";
import { CoreState, selectCoreFeature } from "../index";
import { ErrorLogState } from "./error-log.reducer";

export const selectErrorLogState = createSelector(
	selectCoreFeature,
	(state: CoreState) => state.errorLogState,
);

export const selectErrorMessages = createSelector(
	selectErrorLogState,
	(state: ErrorLogState) => state.messages,
);
