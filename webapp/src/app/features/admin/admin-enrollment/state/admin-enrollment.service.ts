import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { EMPTY, Observable } from "rxjs";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminEnrollment } from "./admin-enrollment.model";
import { AdminEnrollmentStore } from "./admin-enrollment.store";
import { AdminEnrollmentCreateComponent } from "../admin-enrollment-create/admin-enrollment-create.component";
import { AdminEnrollmentEditComponent } from "../admin-enrollment-edit/admin-enrollment-edit.component";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { Page } from "../../../../core/models/page.model";

@Injectable({ providedIn: "root" })
export class AdminEnrollmentService extends AbstractGenericCrudService<AdminEnrollment, string> {

	constructor(
		protected http: HttpClient,
		private adminEnrollmentStore: AdminEnrollmentStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/students/:id/sections", {
			update: false,
			readAll: false,
			readSlice: false,
		});
	}

	sectionId: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["enrollmentStatus"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getPage(sectionId?: string, pageable?: Pageable) {
		this.sectionId = sectionId ? sectionId : this.sectionId;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } });

		if (this.sectionId) {
			httpParams = httpParams.append(`section.id[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, this.sectionId);
		}
		this.readPage(httpParams).pipe(
			tap(enrollmentPage => this.adminEnrollmentStore.update({ enrollmentPage })),
		).subscribe();
	}

	createEnrollment() {
		const dialogRef = this.dialog.open(AdminEnrollmentCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminEnrollment) => {
			if (formValue) {
				this.create(formValue, formValue.studentId).subscribe(enrollment => {
					this.notificationService.open("New Enrollment Created (Cart)!", 2000);
					this.getPage();
				});
			}
		});
	}

	editEnrollment(enrollment: AdminEnrollment) {
		const dialogRef = this.dialog.open(AdminEnrollmentEditComponent, {
			data: { enrollment },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminEnrollment) => {
			if (formValue) {
				this.updatePartial(formValue, enrollment.studentId, enrollment.sectionId).subscribe(enrollment => {
					this.notificationService.open("Changes Saved!", 2000);
					this.getPage();
				});
			}
		});
	}

	deleteEnrollment(enrollment: AdminEnrollment) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: {
					message: "Do you want to remove enrollment " + enrollment.courseCode
						+ "." + enrollment.enrolledNumber.toString().padStart(2, "0") + "?",
				},
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(enrollment.studentId, enrollment.sectionId).subscribe(() => {
					this.notificationService.open("Enrollment Deleted!", 2000);
					this.getPage();
				});
			}
		});
	}

	readPage(queryParams?: HttpParams, id?: string): Observable<Page<AdminEnrollment>> {
		const url = this.getUrlWithId("/admin/enrollments" + this.options.readPageUrl, id);
		return this.http
			.get<Page<AdminEnrollment>>(url, { ...this.httpOptions, params: queryParams })
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	updatePartial(payload: Partial<AdminEnrollment>, id1: string, id2?: string, id3?: string): Observable<AdminEnrollment> {
		const url = this.getUrlWithId(this.entityUrl + this.options.updatePartialUrl + "/enrollment-status", id1, id2, id3);
		return this.http
			.patch<AdminEnrollment>(url, payload, this.httpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

}
