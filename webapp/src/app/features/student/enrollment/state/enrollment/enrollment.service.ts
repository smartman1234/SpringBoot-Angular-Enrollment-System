import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Enrollment } from "./enrollment.model";
import { ErrorLogService } from "../../../../../core/state/error-log/error-log.service";
import { ErrorNotificationService } from "../../../../../core/services/error-notification.service";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { from, Observable, throwError } from "rxjs";
import { QueryParamOperator } from "../../../../../core/constants/query-param-operator.enum";
import { catchError, concatMap, map, take, tap, toArray } from "rxjs/operators";
import { EnrollmentStore } from "./enrollment.store";
import { EnrollmentStatus } from "../../../../../core/constants/enrollment-status";
import { EnrollmentQuery } from "./enrollment.query";
import { EnrollmentIdStore } from "../enrollment-id/enrollment-id.store";
import { EnrollmentIdQuery } from "../enrollment-id/enrollment-id.query";
import { ConfirmDialogComponent } from "../../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { EnrollWaitListDialogComponent } from "../../enroll-wait-list-dialog/enroll-wait-list-dialog.component";

@Injectable({ providedIn: "root" })
export class EnrollmentService extends AbstractGenericCrudService<Enrollment, string> {

	constructor(
		protected http: HttpClient,
		private enrollmentStore: EnrollmentStore,
		private enrollmentQuery: EnrollmentQuery,
		private enrollmentIdStore: EnrollmentIdStore,
		private enrollmentIdQuery: EnrollmentIdQuery,
		private errorLogService: ErrorLogService,
		private errorNotificationService: ErrorNotificationService,
		private dialog: MatDialog,
	) {
		super(http, "/students/:id/sections", {
			updatePartialUrl: "/:id/enrollment-status",
			update: false,
		});
	}

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.openErrorMessages(errorResponse);
		return throwError(errorResponse);
	}

	getAll(enrollmentStatuses: EnrollmentStatus[], termName: string, studentId: string) {
		let queryParams = new HttpParams()
			.append(`section.term.termName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, termName)
			.append(`enrollmentStatus[${QueryParamOperator.IN_IGNORE_CASE}]`, enrollmentStatuses.join(","));

		console.log(studentId);
		this.readAll(queryParams, studentId).pipe(
			tap(enrollments => this.enrollmentStore.set(enrollments)),
		).subscribe();
	}

	addSectionToCart(studentId: string, sectionId: string) {
		this.enrollmentQuery.enrollmentIds().pipe(take(1)).subscribe(enrollmentIds => {
			if (enrollmentIds.length === 20) {
				this.errorNotificationService.open("Registration limit is reached: 20!");
			}

			this.create({ studentId, sectionId }, studentId).pipe(
				tap(enrollment => {
					this.enrollmentIdStore.add({
						sectionId,
						enrollmentStatus: EnrollmentStatus.IN_CART,
					})
				}),
			).subscribe();
		});
	}

	enroll(studentId: string, enrollments: Array<Enrollment>) {
		const successEnrollments: Enrollment[] = [];
		from(enrollments.map(enrollment => enrollment.sectionId)).pipe(
			concatMap(sectionId => this.updatePartial({}, studentId, sectionId).pipe(
				tap(enrollment => successEnrollments.push(enrollment)),
			)),
			toArray(),
			map(enrollments => {
				this.enrollSuccess(enrollments);
			}),
			catchError(errorResponse => {
				this.enrollSuccess(successEnrollments);
				return throwError(errorResponse);
			}),
		).subscribe();
	}

	enrollSuccess(enrollments: Enrollment[]) {
		const enrollmentIds = enrollments.map(enrollment => enrollment.studentId + enrollment.sectionId);
		const sectionIds = enrollments.map(enrollment => enrollment.sectionId);
		this.enrollmentStore.remove(enrollmentIds);
		this.enrollmentIdStore.remove(sectionIds);
		this.enrollmentIdStore.add(enrollments.map(enrollment => ({
			sectionId: enrollment.sectionId,
			enrollmentStatus: enrollment.enrollmentStatus,
		})));
	}

	enrollFromWaitList(studentId: string, sectionId: string) {
		const dialogRef = this.dialog.open(EnrollWaitListDialogComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe(accessCode => {
			if (accessCode) {
				this.updatePartial({ accessCode }, studentId, sectionId).pipe(
					tap(enrollment => {
						this.enrollmentStore.update(studentId + sectionId, enrollment);
						this.enrollmentIdStore.update(sectionId, {
							sectionId,
							enrollmentStatus: enrollment.enrollmentStatus,
						});
					}),
				).subscribe();
			}
		});
	}

	dropEnrollment(enrollment: Enrollment) {
		const message = "Do you want to drop section "
			+ enrollment.courseCode + "."
			+ enrollment.sectionNumber.toString().padStart(2, "0") + "?";

		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: message },
			},
		);
		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.removeEnrollment(enrollment);
			}
		});
	}

	removeEnrollment(enrollment: Enrollment) {
		this.delete(enrollment.studentId, enrollment.sectionId).pipe(
			tap(() => {
				this.enrollmentStore.remove(enrollment.studentId + enrollment.sectionId);
				this.enrollmentIdStore.remove(enrollment.sectionId);
			}),
			catchError(errorResponse => {
				const enrollmentStatuses = enrollment.enrollmentStatus === EnrollmentStatus.IN_CART
					? [EnrollmentStatus.IN_CART]
					: [EnrollmentStatus.ENROLLED, EnrollmentStatus.ON_WAIT_LIST];
				this.getAll(enrollmentStatuses, enrollment.termName, enrollment.studentId);
				return throwError(errorResponse);
			}),
		).subscribe();
	}

	updatePartial(payload: Partial<Enrollment>, id1: string, id2?: string, id3?: string): Observable<Enrollment> {
		const url = this.getUrlWithId(this.entityUrl + this.options.updatePartialUrl, id1, id2, id3);
		return this.http
			.patch<Enrollment>(url, payload, this.httpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

}
