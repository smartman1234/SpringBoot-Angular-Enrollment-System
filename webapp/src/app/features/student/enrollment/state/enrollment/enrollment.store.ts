import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Enrollment } from "./enrollment.model";
import { EnrollmentId } from "../../../models/enrollment.id.model";

export interface EnrollmentState extends EntityState<Enrollment> {
	enrollmentIds: Array<EnrollmentId>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "enrollment", idKey: "_id" })
export class EnrollmentStore extends EntityStore<EnrollmentState> {

	constructor() {
		super({ enrollmentIds: [] });
	}

	akitaPreAddEntity(enrollment: Enrollment): Enrollment & { _id: string; } {
		return {
			...enrollment,
			_id: enrollment.studentId + enrollment.sectionId,
		};
	}

}
