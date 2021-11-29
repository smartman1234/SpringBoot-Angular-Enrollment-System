import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminCollege } from "./admin-college.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminCollegeState extends EntityState<AdminCollege>, ActiveState {
	collegePage: Page<AdminCollege>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-college" })
export class AdminCollegeStore extends EntityStore<AdminCollegeState> {

	constructor() {
		super({ collegePage: emptyPage });
	}

}
