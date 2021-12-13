import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { EMPTY, Observable } from "rxjs";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminDepartmentStore } from "./admin-department.store";
import { AdminDepartment } from "./admin-department.model";
import { AdminDepartmentCreateComponent } from "../admin-department-create/admin-department-create.component";
import { AdminDepartmentEditComponent } from "../admin-department-edit/admin-department-edit.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminDepartmentService extends AbstractGenericCrudService<AdminDepartment, string> {

	constructor(
		protected http: HttpClient,
		private adminDepartmentStore: AdminDepartmentStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/departments");
	}

	collegeName: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["departmentName"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(collegeName?: string) {
		let httpParams = new HttpParams();
		if (collegeName) {
			httpParams = httpParams
				.append(`college.collegeName`, collegeName);
		}
		const readAll$ = this.readAll(httpParams).pipe(tap(entities => {
			this.adminDepartmentStore.set(entities);
		}));

		return cacheable(this.adminDepartmentStore, readAll$);
	}

	getPage(collegeName?: string, pageable?: Pageable) {
		this.collegeName = collegeName ? collegeName : this.collegeName;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`college.collegeName`, this.collegeName);
		this.readPage(httpParams).pipe(
			tap(departmentPage => this.adminDepartmentStore.update({ departmentPage })),
		).subscribe();
	}

	createDepartment() {
		const dialogRef = this.dialog.open(AdminDepartmentCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminDepartment) => {
			if (formValue) {
				this.create(formValue).subscribe(department => {
					this.notificationService.open("New Department Created!", 2000);
					this.adminDepartmentStore.add(department);
					this.getPage();
				});
			}
		});
	}

	editDepartment(department: AdminDepartment) {
		const dialogRef = this.dialog.open(AdminDepartmentEditComponent, {
			data: { department },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminDepartment) => {
			if (formValue) {
				this.update(formValue, department.id).subscribe(department => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminDepartmentStore.update(department.id, department);
					this.getPage();
				});
			}
		});
	}

	deleteDepartment(department: AdminDepartment) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove department " + department.departmentName + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(department.id).subscribe(() => {
					this.notificationService.open("Department Deleted!", 2000);
					this.adminDepartmentStore.remove(department.id);
					this.getPage();
				});
			}
		});
	}

}
