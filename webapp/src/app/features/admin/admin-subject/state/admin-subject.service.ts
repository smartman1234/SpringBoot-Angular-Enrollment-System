import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AdminSubjectStore } from "./admin-subject.store";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { AdminSubject } from "./admin-subject.model";
import { EMPTY, Observable } from "rxjs";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { tap } from "rxjs/operators";
import { cacheable } from "@datorama/akita";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { AdminSubjectCreateComponent } from "../admin-subject-create/admin-subject-create.component";
import { AdminSubjectEditComponent } from "../admin-subject-edit/admin-subject-edit.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminSubjectService extends AbstractGenericCrudService<AdminSubject, string> {

	constructor(
		protected http: HttpClient,
		private adminSubjectStore: AdminSubjectStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/subjects");
	}

	departmentName: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["subjectName"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(): Observable<AdminSubject[] | undefined> {
		const readAll$ = this.readAll().pipe(tap(entities => {
			this.adminSubjectStore.set(entities);
		}));

		return cacheable(this.adminSubjectStore, readAll$);
	}

	getPage(departmentName?: string, pageable?: Pageable) {
		this.departmentName = departmentName ? departmentName : this.departmentName;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`department.departmentName`, this.departmentName);
		this.readPage(httpParams).pipe(
			tap(subjectPage => this.adminSubjectStore.update({ subjectPage })),
		).subscribe();
	}

	createSubject() {
		const dialogRef = this.dialog.open(AdminSubjectCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminSubject) => {
			if (formValue) {
				this.create(formValue).subscribe(subject => {
					this.notificationService.open("New Subject Created!", 2000);
					this.adminSubjectStore.add(subject);
					this.getPage();
				});
			}
		});
	}

	editSubject(subject: AdminSubject) {
		const dialogRef = this.dialog.open(AdminSubjectEditComponent, {
			data: { subject },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminSubject) => {
			if (formValue) {
				this.update(formValue, subject.id).subscribe(subject => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminSubjectStore.update(subject.id, subject);
					this.getPage();
				});
			}
		});
	}

	deleteSubject(subject: AdminSubject) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove subject " + subject.subjectName + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(subject.id).subscribe(() => {
					this.notificationService.open("Subject Deleted!", 2000);
					this.adminSubjectStore.remove(subject.id);
					this.getPage();
				});
			}
		});
	}

}
