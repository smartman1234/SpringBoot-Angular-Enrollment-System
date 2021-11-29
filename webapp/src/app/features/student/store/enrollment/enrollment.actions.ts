import { createAction, props } from "@ngrx/store";
import { Enrollment } from "../../models/enrollment.model";
import { EnrollmentStatus } from "../../../../core/constants/enrollment-status";
import { EnrollmentId } from "../../models/enrollment.id.model";

export const getEnrollments = createAction(
	"[Enrollment] Get Enrollments",
	props<{ enrollmentStatuses: EnrollmentStatus[], termName: string, studentId: string }>(),
);

export const getEnrollmentsSuccess = createAction(
	"[Enrollment] Get Enrollments Success",
	props<{ enrollments: Array<Enrollment> }>(),
);

export const enroll = createAction(
	"[Enrollment] Enroll",
	props<{ termName: string, studentId: string, enrollments: Array<Enrollment> }>(),
);

export const enrollSuccess = createAction(
	"[Enrollment] Enroll Success",
	props<{ enrollments: Array<Enrollment> }>(),
);

export const enrollFromWaitList = createAction(
	"[Enrollment] Enroll From Wait List",
	props<{ termName: string, studentId: string, sectionId: string }>(),
);

export const enrollFromWaitListSuccess = createAction(
	"[Enrollment] Enroll From Wait List Success",
	props<{ enrollment: Enrollment }>(),
);

export const dropEnrollment = createAction(
	"[Enrollment] Drop Enrollment",
	props<{ enrollment: Enrollment }>(),
);

export const removeEnrollment = createAction(
	"[Enrollment] Remove Enrollment",
	props<{ enrollment: Enrollment }>(),
);

export const removeEnrollmentSuccess = createAction(
	"[Enrollment] Remove Enrollment Success",
	props<{ sectionId: string }>(),
);

export const getEnrollmentIds = createAction(
	"[Enrollment] Get Enrollment Ids",
	props<{ termName: string, studentId: string }>(),
);

export const getEnrollmentIdsSuccess = createAction(
	"[Enrollment] Get Enrollment Ids Success",
	props<{ enrollmentIds: Array<EnrollmentId> }>(),
);

export const addSectionToCart = createAction(
	"[Enrollment] Add Section To Cart",
	props<{ studentId: string, sectionId: string }>(),
);

export const addSectionToCartSuccess = createAction(
	"[Enrollment] Add Section To Cart Success",
	props<{ sectionId: string }>(),
);
