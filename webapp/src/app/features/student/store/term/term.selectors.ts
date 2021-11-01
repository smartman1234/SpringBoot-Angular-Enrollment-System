import { createSelector } from "@ngrx/store";
import { TermsState } from "./term.reducer";
import { Term } from "../../models/term.model";
import { selectStudentFeature, StudentState } from "../index";

export const selectTermsState = createSelector(
	selectStudentFeature,
	(state: StudentState) => state.termsState,
);
export const selectTerms = createSelector(
	selectTermsState,
	(state: TermsState) => state.terms,
);
export const selectTermNames = createSelector(
	selectTerms,
	(terms: Array<Term>) => terms.map(term => term.termName),
);
