import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../shared/store/app-store.module";
import {
	addSectionToCart,
	addSectionToCartSuccess,
	dropEnrollment,
	enroll,
	enrollFromWaitList,
	enrollFromWaitListSuccess,
	enrollSuccess,
	getEnrollmentIds,
	getEnrollmentIdsSuccess,
	getEnrollments,
	getEnrollmentsSuccess,
	removeEnrollment,
	removeEnrollmentSuccess,
} from "./enrollment.actions";
import {
	catchError,
	concatMap,
	exhaustMap,
	map,
	mergeMap,
	switchMap,
	tap,
	toArray,
	withLatestFrom,
} from "rxjs/operators";
import { EnrollmentService } from "../../services/enrollment.service";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { EMPTY, from, of } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { EnrollWaitListDialogComponent } from "../../components/enroll-wait-list-dialog/enroll-wait-list-dialog.component";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { Enrollment } from "../../models/enrollment.model";
import { EnrollmentStatus } from "../../constant/enrollment-status";
import { HttpParams } from "@angular/common/http";
import { ErrorNotificationService } from "../../../../core/services/error-notification.service";
import { selectEnrollmentIds } from "./enrollment.selectors";

@Injectable()
export class EnrollmentEffects {

	constructor(
		private actions$: Actions,
		private store: Store<AppState>,
		private enrollmentService: EnrollmentService,
		private errorNotificationService: ErrorNotificationService,
		private dialog: MatDialog,
	) {
	}

	addSectionToCart$ = createEffect(() => this.actions$.pipe(
		ofType(addSectionToCart),
		withLatestFrom(this.store.pipe(select(selectEnrollmentIds()))),
		mergeMap(([action, enrollmentIds]) => {
			if (enrollmentIds.length === 20) {
				this.errorNotificationService.open("Registration limit is reached: 20!");
				return EMPTY;
			}
			return this.enrollmentService
				.create({ studentId: action.studentId, sectionId: action.sectionId }, action.studentId)
				.pipe(
					map(() => {
						return addSectionToCartSuccess({ sectionId: action.sectionId });
					}),
					catchError(errorResponse => {
						this.errorNotificationService.open(errorResponse);
						return EMPTY;
					}),
				);
		})),
	);

	getEnrollmentIds$ = createEffect(() => this.actions$.pipe(
		ofType(getEnrollmentIds),
		switchMap(action => {
			return this.enrollmentService.getEnrollmentIds(action.termName, action.studentId).pipe(
				map(enrollmentIds => {
					return getEnrollmentIdsSuccess({ enrollmentIds });
				}),
				catchError(errorResponse => {
					this.errorNotificationService.open(errorResponse);
					return EMPTY;
				}),
			);
		})),
	);

	getEnrollments$ = createEffect(() => this.actions$.pipe(
		ofType(getEnrollments),
		switchMap(action => {
			let queryParams = new HttpParams();
			const termKey = `section.term.termName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`;
			queryParams = queryParams.append(termKey, action.termName);

			const key = `enrollmentStatus[${QueryParamOperator.IN_IGNORE_CASE}]`;
			queryParams = queryParams.append(key, action.enrollmentStatuses.join(","));

			return this.enrollmentService.readAll(queryParams, action.studentId).pipe(
				map(enrollments => {
					return getEnrollmentsSuccess({ enrollments });
				}),
				catchError(errorResponse => {
					this.enrollmentService.openErrorMessages(errorResponse);
					return EMPTY;
				}),
			);
		})),
	);

	enroll$ = createEffect(() => this.actions$.pipe(
		ofType(enroll),
		exhaustMap(action => {
			const successEnrolling: Enrollment[] = [];
			return from(action.enrollments.map(enrollment => enrollment.sectionId)).pipe(
				concatMap(sectionId => this.enrollmentService
					.updatePartial({}, action.studentId, sectionId).pipe(
						tap(enrollment => successEnrolling.push(enrollment)),
					)),
				toArray(),
				map(enrollments => {
					return enrollSuccess({ enrollments });
				}),
				catchError(errorResponse => {
					this.enrollmentService.openErrorMessages(errorResponse);
					return of(enrollSuccess({ enrollments: successEnrolling }));
				}),
			);
		})),
	);

	enrollFromWaitList$ = createEffect(() => this.actions$.pipe(
		ofType(enrollFromWaitList),
		exhaustMap(action => {
			const dialogRef = this.dialog.open(EnrollWaitListDialogComponent, { width: "70rem" });
			return dialogRef.afterClosed().pipe(
				mergeMap(accessCode => {
					if (accessCode == null || accessCode === "") {
						return EMPTY;
					}
					return this.enrollmentService
						.updatePartial({ accessCode }, action.studentId, action.sectionId)
						.pipe(
							map(enrollment => {
								this.store.dispatch(enrollFromWaitListSuccess({ enrollment }));
							}),
							catchError(errorResponse => {
								this.enrollmentService.openErrorMessages(errorResponse);
								return EMPTY;
							}),
						);
				}),
			);
		})), { dispatch: false },
	);

	dropEnrollment$ = createEffect(() => this.actions$.pipe(
		ofType(dropEnrollment),
		mergeMap(action => {
			const enrollment: Enrollment = action.enrollment;

			const message = "Do you want to drop section "
				+ enrollment.courseCode + "."
				+ String(enrollment.sectionNumber).padStart(2, "0") + "?";

			const dialogRef = this.dialog.open(ConfirmDialogComponent, {
					width: "50rem",
					data: { message: message },
				},
			);
			return dialogRef.afterClosed().pipe(
				map(confirm => {
					if (confirm === true) {
						this.store.dispatch(removeEnrollment({ enrollment }));
					}
				}),
			);
		})), { dispatch: false },
	);

	removeEnrollment$ = createEffect(() => this.actions$.pipe(
		ofType(removeEnrollment),
		mergeMap(action => {
			const enrollment: Enrollment = action.enrollment;
			return this.enrollmentService.delete(enrollment.studentId, enrollment.sectionId).pipe(
				map(() => {
					return removeEnrollmentSuccess({ sectionId: enrollment.sectionId });
				}),
				catchError(errorResponse => {
					this.enrollmentService.openErrorMessages(errorResponse);
					return of(getEnrollments({
						enrollmentStatuses: enrollment.enrollmentStatus === EnrollmentStatus.IN_CART
							? [EnrollmentStatus.IN_CART]
							: [EnrollmentStatus.ENROLLED, EnrollmentStatus.ON_WAIT_LIST],
						studentId: enrollment.studentId,
						termName: enrollment.termName,
					}));
				}),
			);
		})),
	);
}
