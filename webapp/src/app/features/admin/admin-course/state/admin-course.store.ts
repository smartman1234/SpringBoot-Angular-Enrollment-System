import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminCourse } from "./admin-course.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminCourseState extends EntityState<AdminCourse>, ActiveState {
	coursePage: Page<AdminCourse>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-course" })
export class AdminCourseStore extends EntityStore<AdminCourseState> {

	constructor() {
		super({ coursePage: emptyPage });
	}
}
