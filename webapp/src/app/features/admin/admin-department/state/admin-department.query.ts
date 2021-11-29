import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminDepartmentState, AdminDepartmentStore } from "./admin-department.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "departmentName",
	sortByOrder: Order.ASC,
})
export class AdminDepartmentQuery extends QueryEntity<AdminDepartmentState> {

	adminDepartments$ = this.selectAll();
	adminDepartmentPage$ = this.select(state => state.departmentPage);

	constructor(protected store: AdminDepartmentStore) {
		super(store);
	}

}
