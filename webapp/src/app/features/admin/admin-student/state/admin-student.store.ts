import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminStudent } from "./admin-student.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminStudentState extends EntityState<AdminStudent>, ActiveState {
	studentPage: Page<AdminStudent>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-student" })
export class AdminStudentStore extends EntityStore<AdminStudentState> {

	constructor() {
		super({ studentPage: emptyPage });
	}

}
