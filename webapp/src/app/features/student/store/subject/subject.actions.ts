import { createAction, props } from "@ngrx/store";
import { Subject } from "../../models/subject.model";

export const getAllSubjects = createAction("[Subject] Get All");

export const getAllSubjectsSuccess = createAction(
	"[Subject] Get All Success",
	props<{ subjects: Array<Subject> }>(),
);
