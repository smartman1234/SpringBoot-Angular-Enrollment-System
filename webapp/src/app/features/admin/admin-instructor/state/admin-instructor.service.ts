import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { NotificationService } from "../../../../core/services/notification.service";
import { EMPTY, Observable } from "rxjs";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminInstructorStore } from "./admin-instructor.store";
import { AdminInstructor } from "./admin-instructor.model";
import { AdminInstructorCreateComponent } from "../admin-instructor-create/admin-instructor-create.component";
import { AdminInstructorEditComponent } from "../admin-instructor-edit/admin-instructor-edit.component";

@Injectable({ providedIn: "root" })
export class AdminInstructorService extends AbstractGenericCrudService<AdminInstructor, string> {

	constructor(
		protected http: HttpClient,
		private adminInstructorStore: AdminInstructorStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/instructors");
	}

	departmentName: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["email"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(departmentName: string) {
		let httpParams = new HttpParams()
			.append(`department.departmentName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, departmentName);
		const readAll$ = this.readAll(httpParams).pipe(tap(entities => {
			this.adminInstructorStore.set(entities);
		}));

		return cacheable(this.adminInstructorStore, readAll$);
	}

	getPage(departmentName?: string, pageable?: Pageable) {
		this.departmentName = departmentName ? departmentName : this.departmentName;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`department.departmentName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, this.departmentName);
		this.readPage(httpParams).pipe(
			tap(instructorPage => this.adminInstructorStore.update({ instructorPage })),
		).subscribe();
	}

	getPage2(pageable: Pageable, departmentName?: string) {
		let httpParams = new HttpParams({ fromObject: { ...pageable } });

		if (departmentName) {
			httpParams = httpParams
				.append(`department.departmentName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, departmentName);
		}

		return this.readPage(httpParams);
	}

	createInstructor() {
		const dialogRef = this.dialog.open(AdminInstructorCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminInstructor) => {
			if (formValue) {
				this.create(formValue).subscribe(instructor => {
					this.notificationService.open("New Instructor Created!", 2000);
					this.adminInstructorStore.add(instructor);
					this.getPage();
				});
			}
		});
	}

	editInstructor(instructor: AdminInstructor) {
		const dialogRef = this.dialog.open(AdminInstructorEditComponent, {
			data: { instructor },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminInstructor) => {
			if (formValue) {
				this.update(formValue, instructor.id).subscribe(instructor => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminInstructorStore.update(instructor.id, instructor);
					this.getPage();
				});
			}
		});
	}

	deleteInstructor(instructor: AdminInstructor) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: {
					message: "Do you want to remove instructor "
						+ instructor.firstName + " " + instructor.lastName + "?",
				},
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(instructor.id).subscribe(() => {
					this.notificationService.open("Instructor Deleted!", 2000);
					this.adminInstructorStore.remove(instructor.id);
					this.getPage();
				});
			}
		});
	}

}
