import { ActionReducerMap, createFeatureSelector } from "@ngrx/store";
import { PageSectionReducer, PageSectionState } from "./section/section.reducer";
import { EnrollmentReducer, EnrollmentState } from "./enrollment/enrollment.reducer";
import { termsReducer, TermsState } from "./term/term.reducer";
import { SearchInput, searchInputReducer } from "./search-input/search-input.reducer";
import { Student } from "../models/student.model";
import { studentReducer } from "./student/student.reducer";
import { subjectsReducer, SubjectsState } from "./subject/subject.reducer";

export interface StudentState {
	pageSectionState: PageSectionState,
	enrollmentState: EnrollmentState,
	termsState: TermsState,
	subjectsState: SubjectsState,
	searchInputState: SearchInput,
	studentState: Student,
}

export const studentReducers: ActionReducerMap<StudentState> = {
	pageSectionState: PageSectionReducer,
	enrollmentState: EnrollmentReducer,
	termsState: termsReducer,
	subjectsState: subjectsReducer,
	searchInputState: searchInputReducer,
	studentState: studentReducer,
};

export const studentFeatureKey = "student";

export const selectStudentFeature = createFeatureSelector<StudentState>(studentFeatureKey);
