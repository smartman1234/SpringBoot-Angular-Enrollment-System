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
import { EnrollmentStatus } from "../../constant/enrollment-status";

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
		enrollments:  state.enrollments
			.filter(enrollment => !enrollments.some(e => e.sectionId === enrollment.sectionId)),
		enrollmentIds: state.enrollmentIds
			.filter(enrollment => !enrollments.some(e => e.sectionId === enrollment.sectionId))
			.concat(enrollments.map(enrollment => ({
				sectionId: enrollment.sectionId,
				enrollmentStatus: enrollment.enrollmentStatus,
			}))),
	})),
	on(enrollFromWaitListSuccess, (state, { enrollment }) => ({
		enrollments: state.enrollments.filter(e => e.sectionId !== enrollment.sectionId).concat(enrollment),
		enrollmentIds: state.enrollmentIds
			.filter(e => e.sectionId !== enrollment.sectionId)
			.concat({
				sectionId: enrollment.sectionId,
				enrollmentStatus: EnrollmentStatus.ENROLLED,
			}),
	})),
	on(removeEnrollmentSuccess, (state, { sectionId }) => ({
		enrollments: state.enrollments.filter(e => e.sectionId !== sectionId),
		enrollmentIds: state.enrollmentIds.filter(e => e.sectionId !== sectionId),
	})),
	on(getEnrollmentIdsSuccess, (state, { enrollmentIds }) => ({
		...state,
		enrollmentIds,
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
