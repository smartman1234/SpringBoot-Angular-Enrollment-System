import { Term } from "../../models/term.model";
import { Action, createReducer, on } from "@ngrx/store";
import { getAllTermsSuccess } from "./term.actions";

export interface TermsState {
	terms: Array<Term>,
}

export const initialTermsState: TermsState = {
	terms: [],
};

const reducer = createReducer(
	initialTermsState,
	on(getAllTermsSuccess, (state, { terms }) => ({ ...state, terms })),
);

export function termsReducer(state: TermsState | undefined, action: Action) {
	return reducer(state, action);
}
