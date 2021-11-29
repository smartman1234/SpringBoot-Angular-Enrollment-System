import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { StudentState, StudentStore } from "./student.store";

@Injectable({ providedIn: "root" })
export class StudentQuery extends Query<StudentState> {

	student$ = this.select(state => state)

	constructor(protected store: StudentStore) {
		super(store);
	}

}
