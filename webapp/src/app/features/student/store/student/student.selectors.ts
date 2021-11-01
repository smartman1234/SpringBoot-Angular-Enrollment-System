import { createSelector } from "@ngrx/store";
import { selectStudentFeature, StudentState } from "../index";

export const selectStudentState = createSelector(
	selectStudentFeature,
	(state: StudentState) => state.studentState,
);
