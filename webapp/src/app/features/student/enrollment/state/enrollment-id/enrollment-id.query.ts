import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { EnrollmentIdState, EnrollmentIdStore } from "./enrollment-id.store";
import { EnrollmentStatus } from "../../../../../core/constants/enrollment-status";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

const allEnrollmentStatuses = [
	EnrollmentStatus.IN_CART,
	EnrollmentStatus.ENROLLED,
	EnrollmentStatus.ON_WAIT_LIST,
];

@Injectable({ providedIn: "root" })
export class EnrollmentIdQuery extends QueryEntity<EnrollmentIdState> {

	enrollmentIds(statuses: EnrollmentStatus[] = allEnrollmentStatuses): Observable<string[]> {
		return this.selectAll({
				filterBy: [
					(enrollmentId) => statuses.some(status => status === enrollmentId.enrollmentStatus)
				],
			}
		).pipe(map(enrollmentIds => enrollmentIds.map(enrollmentId => enrollmentId.sectionId)));
	}

	enrollmentIdNumber(statuses: EnrollmentStatus[] = []): Observable<number> {
		return this.enrollmentIds(statuses).pipe(
			map(enrollmentIds => enrollmentIds.length),
		);
	}

	constructor(protected store: EnrollmentIdStore) {
		super(store);
	}

}
