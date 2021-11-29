import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { EMPTY, Observable } from "rxjs";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminStudentStore } from "./admin-student.store";
import { AdminStudent } from "./admin-student.model";
import { AdminStudentCreateComponent } from "../admin-student-create/admin-student-create.component";
import { AdminStudentEditComponent } from "../admin-student-edit/admin-student-edit.component";
import { Page } from "../../../../core/models/page.model";

@Injectable({ providedIn: "root" })
export class AdminStudentService extends AbstractGenericCrudService<AdminStudent, string> {

	constructor(
		protected http: HttpClient,
		private adminStudentStore: AdminStudentStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/students");
	}

	pageable = {
		...this.defaultPageable,
		sort: ["email"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll() {
		const readAll$ = this.readAll().pipe(tap(entities => {
			this.adminStudentStore.set(entities);
		}));

		return cacheable(this.adminStudentStore, readAll$);
	}

	getPage(pageable?: Pageable) {
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } });
		this.readPage(httpParams).pipe(
			tap(studentPage => this.adminStudentStore.update({ studentPage })),
		).subscribe();
	}

	getPage2(pageable: Pageable): Observable<Page<AdminStudent>> {
		let httpParams = new HttpParams({ fromObject: { ...pageable } });
		return this.readPage(httpParams);
	}

	createStudent() {
		const dialogRef = this.dialog.open(AdminStudentCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminStudent) => {
			if (formValue) {
				this.create(formValue).subscribe(student => {
					this.notificationService.open("New Student Created!", 2000);
					this.adminStudentStore.add(student);
					this.getPage();
				});
			}
		});
	}

	editStudent(student: AdminStudent) {
		const dialogRef = this.dialog.open(AdminStudentEditComponent, {
			data: { student },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminStudent) => {
			if (formValue) {
				this.update(formValue, student.id).subscribe(student => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminStudentStore.update(student.id, student);
					this.getPage();
				});
			}
		});
	}

	deleteStudent(student: AdminStudent) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: {
					message: "Do you want to remove student "
						+ student.firstName + " " + student.lastName + "?",
				},
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(student.id).subscribe(() => {
					this.notificationService.open("Student Deleted!", 2000);
					this.adminStudentStore.remove(student.id);
					this.getPage();
				});
			}
		});
	}

}
