import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminEnrollment } from "./admin-enrollment.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminEnrollmentState extends EntityState<AdminEnrollment> {
	enrollmentPage: Page<AdminEnrollment>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-enrollment", idKey: "_id" })
export class AdminEnrollmentStore extends EntityStore<AdminEnrollmentState> {

	constructor() {
		super({ enrollmentPage: emptyPage });
	}

	akitaPreAddEntity(newEntity: AdminEnrollment): AdminEnrollment & { _id: string } {
		return {
			...newEntity,
			_id: newEntity.studentId + newEntity.sectionId,
		};
	}

}
