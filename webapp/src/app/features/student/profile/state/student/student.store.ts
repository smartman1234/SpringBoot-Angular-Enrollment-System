import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";
import { Student } from "./student.model";

export interface StudentState extends Student {
}

export const initialStudentState = (): StudentState => ({
	email: "",
	maxUnit: "",
	firstName: "",
	lastName: "",
});

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "student" })
export class StudentStore extends Store<StudentState> {

	constructor() {
		super(initialStudentState());
	}

}
