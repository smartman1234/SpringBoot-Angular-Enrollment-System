import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminInstructorState, AdminInstructorStore } from "./admin-instructor.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "email",
	sortByOrder: Order.ASC,
})
export class AdminInstructorQuery extends QueryEntity<AdminInstructorState> {

	adminInstructors$ = this.selectAll();
	adminInstructorPage$ = this.select(state => state.instructorPage);

	constructor(protected store: AdminInstructorStore) {
		super(store);
	}

}
