import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminDepartment } from "./admin-department.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminDepartmentState extends EntityState<AdminDepartment>, ActiveState {
	departmentPage: Page<AdminDepartment>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-department" })
export class AdminDepartmentStore extends EntityStore<AdminDepartmentState> {

	constructor() {
		super({ departmentPage: emptyPage });
	}

}
