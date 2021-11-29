import { createSelector } from "@ngrx/store";
import { selectStudentFeature, StudentState } from "../index";
import { SubjectsState } from "./subject.reducer";
import { Subject } from "../../models/subject.model";

export const selectSubjectsState = createSelector(
	selectStudentFeature,
	(state: StudentState) => state.subjectsState,
);
export const selectSubjects = createSelector(
	selectSubjectsState,
	(state: SubjectsState) => state.subjects,
);
export const selectSubjectAcronyms = createSelector(
	selectSubjects,
	(subjects: Array<Subject>) => subjects.map(subject => subject.subjectAcronym),
);
export const selectSubjectNames = createSelector(
	selectSubjects,
	(subjects: Array<Subject>) => subjects.map(subject => subject.subjectName),
);
