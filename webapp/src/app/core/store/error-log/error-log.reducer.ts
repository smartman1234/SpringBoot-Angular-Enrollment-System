import { Action, createReducer, on } from "@ngrx/store";
import { addErrorLog, resetErrorLogs, updateErrorLogs } from "./error-log.actions";
import { HttpErrorResponse } from "@angular/common/http";

export interface ErrorLogState {
	messages: string[],
}

export const initialErrorLogState: ErrorLogState = {
	messages: [],
};


const reducer = createReducer(
	initialErrorLogState,
	on(addErrorLog, (state, { error }) => ({ messages: [errorToMessage(error)].concat(state.messages) })),
	on(updateErrorLogs, (state, { errors }) => ({ messages: errors.map(error => errorToMessage(error)) })),
	on(resetErrorLogs, () => initialErrorLogState),
);

const errorToMessage = (errorResponse: any): string => {
	return errorResponse instanceof HttpErrorResponse && errorResponse.error != null
		? errorResponse.error.message : errorResponse.message ? errorResponse.message : errorResponse;
}

export function ErrorLogReducer(state: ErrorLogState | undefined, action: Action) {
	return reducer(state, action);
}

