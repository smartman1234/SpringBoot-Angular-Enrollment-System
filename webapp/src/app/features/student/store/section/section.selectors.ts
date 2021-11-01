import { createSelector } from "@ngrx/store";
import { PageSectionState } from "./section.reducer";
import { selectStudentFeature, StudentState } from "../index";

export const selectPageSection = createSelector(
	selectStudentFeature,
	(state: StudentState) => state.pageSectionState,
);

export const selectCourseSections = createSelector(
	selectPageSection,
	(state: PageSectionState) => state.content,
);
