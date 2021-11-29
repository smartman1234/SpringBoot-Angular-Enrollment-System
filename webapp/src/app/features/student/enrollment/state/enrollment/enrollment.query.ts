import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { EnrollmentState, EnrollmentStore } from "./enrollment.store";
import { EnrollmentStatus } from "../../../../../core/constants/enrollment-status";
import { map } from "rxjs/operators";
import { Observable } from "rxjs";

const allEnrollmentStatuses = [
	EnrollmentStatus.IN_CART,
	EnrollmentStatus.ENROLLED,
	EnrollmentStatus.ON_WAIT_LIST,
];

@Injectable({ providedIn: "root" })
export class EnrollmentQuery extends QueryEntity<EnrollmentState> {

	enrollments$ = this.selectAll();

	enrollmentIds(statuses: EnrollmentStatus[] = allEnrollmentStatuses): Observable<string[]> {
		return this.select(state => state.enrollmentIds
			.filter(enrollmentId => statuses.some(status => status === enrollmentId.enrollmentStatus))
			.map(enrollmentId => enrollmentId.sectionId),
		);
	}

	enrollmentIdNumber(statuses: EnrollmentStatus[] = []): Observable<number> {
		return this.enrollmentIds(statuses).pipe(
			map(enrollmentIds => enrollmentIds.length),
		);
	}

	constructor(protected store: EnrollmentStore) {
		super(store);
	}

}
