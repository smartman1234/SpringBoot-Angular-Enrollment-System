import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminSubject } from "./admin-subject.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminSubjectState extends EntityState<AdminSubject>, ActiveState {
	subjectPage: Page<AdminSubject>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-subject" })
export class AdminSubjectStore extends EntityStore<AdminSubjectState> {

	constructor() {
		super({ subjectPage: emptyPage });
	}

}
