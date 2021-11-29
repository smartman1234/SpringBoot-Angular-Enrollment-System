import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminStudentState, AdminStudentStore } from "./admin-student.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "email",
	sortByOrder: Order.ASC,
})
export class AdminStudentQuery extends QueryEntity<AdminStudentState> {

	adminStudents$ = this.selectAll();
	adminStudentPage$ = this.select(state => state.studentPage);

	constructor(protected store: AdminStudentStore) {
		super(store);
	}

}
