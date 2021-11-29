import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminInstructor } from "./admin-instructor.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminInstructorState extends EntityState<AdminInstructor>, ActiveState {
	instructorPage: Page<AdminInstructor>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-instructor" })
export class AdminInstructorStore extends EntityStore<AdminInstructorState> {

	constructor() {
		super({ instructorPage: emptyPage });
	}

}
