import { Action, createReducer, on } from "@ngrx/store";
import { Student } from "../../models/student.model";
import { getStudentSuccess } from "./student.actions";

export const initialStudentState: Student = {
	id: "",
	email: "",
	maxUnit: "",
	firstName: "",
	lastName: "",
};

const reducer = createReducer(
	initialStudentState,
	on(getStudentSuccess, (state, { student }) => ({ ...student })),
);

export function studentReducer(state: Student | undefined, action: Action) {
	return reducer(state, action);
}
