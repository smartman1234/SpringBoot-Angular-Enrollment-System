import { Action, createReducer, on } from "@ngrx/store";
import { Subject } from "../../models/subject.model";
import { getAllSubjectsSuccess } from "./subject.actions";

export interface SubjectsState {
	subjects: Array<Subject>,
}

export const initialSubjectsState: SubjectsState = {
	subjects: [],
};

const reducer = createReducer(
	initialSubjectsState,
	on(getAllSubjectsSuccess, (state, { subjects }) => ({ ...state, subjects })),
);

export function subjectsReducer(state: SubjectsState | undefined, action: Action) {
	return reducer(state, action);
}
