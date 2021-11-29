import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { AdminEnrollmentState, AdminEnrollmentStore } from "./admin-enrollment.store";

@Injectable({ providedIn: "root" })
export class AdminEnrollmentQuery extends QueryEntity<AdminEnrollmentState> {

	adminEnrollmentPage$ = this.select(state => state.enrollmentPage);

	constructor(protected store: AdminEnrollmentStore) {
		super(store);
	}

}
