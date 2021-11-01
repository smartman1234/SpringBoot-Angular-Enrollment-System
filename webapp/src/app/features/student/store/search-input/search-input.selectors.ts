import { createSelector } from "@ngrx/store";
import { selectStudentFeature, StudentState } from "../index";
import { SearchInput } from "./search-input.reducer";

export const selectSearchInput = createSelector(
	selectStudentFeature,
	(state: StudentState) => state.searchInputState,
);

export const selectTermInput = createSelector(
	selectSearchInput,
	(searchInput: SearchInput) => searchInput.term,
);


