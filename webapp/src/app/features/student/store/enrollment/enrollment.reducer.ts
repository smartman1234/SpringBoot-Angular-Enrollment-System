import { Enrollment } from "../../models/enrollment.model";
import { Action, createReducer, on } from "@ngrx/store";
import {
	addSectionToCartSuccess,
	enrollFromWaitListSuccess,
	enrollSuccess,
	getEnrollmentIdsSuccess,
	getEnrollmentsSuccess,
	removeEnrollmentSuccess,
} from "./enrollment.actions";
import { EnrollmentId } from "../../models/enrollment.id.model";
import { EnrollmentStatus } from "../../../../core/constants/enrollment-status";

export interface EnrollmentState {
	enrollmentIds: Array<EnrollmentId>,
	enrollments: Array<Enrollment>,
}

export const initialEnrollmentState: EnrollmentState = {
	enrollmentIds: [],
	enrollments: [],
};

const reducer = createReducer(
	initialEnrollmentState,
	on(getEnrollmentsSuccess, (state, { enrollments }) => ({
		...state,
		enrollments,
	})),
	on(enrollSuccess, (state, { enrollments }) => ({
		enrollments: state.enrollments
			.filter(enrollment => !enrollments.some(e => e.sectionId === enrollment.sectionId)),
		enrollmentIds: state.enrollmentIds
			.filter(enrollment => !enrollments.some(e => e.sectionId === enrollment.sectionId))
			.concat(enrollments.map(enrollment => ({
				sectionId: enrollment.sectionId,
				enrollmentStatus: enrollment.enrollmentStatus,
			}))),
	})),
	on(enrollFromWaitListSuccess, (state, { enrollment }) => {
		let enrollingEnrollment: Enrollment | undefined = state
			.enrollments.find(e => e.sectionId === enrollment.sectionId);
		if (enrollingEnrollment) {
			enrollingEnrollment = {
				...enrollingEnrollment,
				enrollmentStatus: EnrollmentStatus.ENROLLED,
			};
		} else {
			enrollingEnrollment = enrollment;
		}
		return {
			enrollments: state.enrollments.filter(e => e.sectionId !== enrollment.sectionId).concat(enrollingEnrollment),
			enrollmentIds: state.enrollmentIds
				.filter(e => e.sectionId !== enrollment.sectionId)
				.concat({
					sectionId: enrollment.sectionId,
					enrollmentStatus: EnrollmentStatus.ENROLLED,
				}),
		};
	}),
	on(removeEnrollmentSuccess, (state, { sectionId }) => ({
		enrollments: state.enrollments.filter(e => e.sectionId !== sectionId),
		enrollmentIds: state.enrollmentIds.filter(e => e.sectionId !== sectionId),
	})),
	on(getEnrollmentIdsSuccess, (state, { enrollmentIds }) => ({
		...state,
		enrollmentIds,
		// enrollmentIds: state.enrollmentIds
		// 	.filter(enrollment => !enrollmentIds.some(e => e.sectionId === enrollment.sectionId))
		// 	.concat(enrollmentIds),
	})),
	on(addSectionToCartSuccess, (state, { sectionId }) => ({
		...state,
		enrollmentIds: state.enrollmentIds.concat({
			sectionId,
			enrollmentStatus: EnrollmentStatus.IN_CART,
		}),
	})),
);

export function EnrollmentReducer(state: EnrollmentState | undefined, action: Action) {
	return reducer(state, action);
}
