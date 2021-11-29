import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminSubjectState, AdminSubjectStore } from "./admin-subject.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "subjectName",
	sortByOrder: Order.ASC,
})
export class AdminSubjectQuery extends QueryEntity<AdminSubjectState> {

	adminSubjects$ = this.selectAll();
	adminSubjectPage$ = this.select(state => state.subjectPage);

	constructor(protected store: AdminSubjectStore) {
		super(store);
	}

}
