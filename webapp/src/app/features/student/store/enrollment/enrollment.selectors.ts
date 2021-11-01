import { createSelector } from "@ngrx/store";
import { EnrollmentState } from "./enrollment.reducer";
import { EnrollmentStatus } from "../../constant/enrollment-status";
import { selectStudentFeature, StudentState } from "../index";

export const selectEnrollmentState = createSelector(
	selectStudentFeature,
	(state: StudentState) => state.enrollmentState,
);

export const selectEnrollments = createSelector(
	selectEnrollmentState,
	(state: EnrollmentState) => state.enrollments,
);

const allEnrollmentStatuses = [
	EnrollmentStatus.IN_CART,
	EnrollmentStatus.ENROLLED,
	EnrollmentStatus.ON_WAIT_LIST
]

export const selectEnrollmentIds = (statuses: EnrollmentStatus[] = allEnrollmentStatuses) => createSelector(
	selectEnrollmentState,
	(state: EnrollmentState) => state.enrollmentIds
		.filter(enrollmentId => statuses.some(status => status === enrollmentId.enrollmentStatus))
		.map(enrollmentId => enrollmentId.sectionId),
);

export const selectEnrollmentIdNumber = (statuses: EnrollmentStatus[] = []) => createSelector(
	selectEnrollmentIds(statuses),
	(enrollmentIds: string[]) => enrollmentIds.length,
);


