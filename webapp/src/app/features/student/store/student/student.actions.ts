import { createAction, props } from "@ngrx/store";
import { Student } from "../../models/student.model";

export const getStudent = createAction(
	"[Student] Get Profile",
	props<{ id: string }>(),
);

export const getStudentSuccess = createAction(
	"[Student] Get Profile Success",
	props<{ student: Student }>(),
);
