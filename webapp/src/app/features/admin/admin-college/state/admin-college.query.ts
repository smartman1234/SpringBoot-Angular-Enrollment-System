import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminCollegeState, AdminCollegeStore } from "./admin-college.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "collegeName",
	sortByOrder: Order.ASC
})
export class AdminCollegeQuery extends QueryEntity<AdminCollegeState> {

	adminColleges$ = this.selectAll();
	adminCollegePage$ = this.select(state => state.collegePage);

	constructor(protected store: AdminCollegeStore) {
		super(store);
	}

}
