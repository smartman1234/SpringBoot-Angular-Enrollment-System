import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { catchError, tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { EMPTY, Observable } from "rxjs";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminUserStore } from "./admin-user.store";
import { AdminUser } from "./admin-user.model";
import { AdminUserCreateComponent } from "../admin-user-create/admin-user-create.component";
import { AdminUserEditComponent } from "../admin-user-edit/admin-user-edit.component";
import { AdminUserPasswordChangeComponent } from "../admin-user-password-change/admin-user-password-change.component";
import { AdminUserPasswordChange } from "./admin-user-password-change.model";
import { NotificationService } from "../../../../core/services/notification.service";
import { Page } from "../../../../core/models/page.model";

@Injectable({ providedIn: "root" })
export class AdminUserService extends AbstractGenericCrudService<AdminUser, string> {

	constructor(
		protected http: HttpClient,
		private adminUserStore: AdminUserStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/users");
	}

	roles: string[] = [];
	pageable = {
		...this.defaultPageable,
		sort: ["username"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(roles: string[]) {
		let httpParams = new HttpParams()
			.append(`authorities.role[${QueryParamOperator.IN_IGNORE_CASE}]`, roles.join(","));
		const readAll$ = this.readAll(httpParams).pipe(tap(entities => {
			this.adminUserStore.set(entities);
		}));

		return cacheable(this.adminUserStore, readAll$);
	}

	getPage(roles?: string[], pageable?: Pageable) {
		this.roles = roles ? roles : this.roles;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`authorities.role[${QueryParamOperator.IN_IGNORE_CASE}]`, this.roles.join(","));
		this.readPage(httpParams).pipe(
			tap(userPage => this.adminUserStore.update({ userPage })),
		).subscribe();
	}

	getPage2(pageable: Pageable, roles?: string[], lastName?: string): Observable<Page<AdminUser>> {

		let httpParams = new HttpParams({ fromObject: { ...pageable } });
		if (roles) {
			httpParams = httpParams
				.append(`authorities.role[${QueryParamOperator.IN_IGNORE_CASE}]`, roles.join(","));
		}

		if (lastName) {
			httpParams = httpParams
				.append(`lastName[${QueryParamOperator.IN_IGNORE_CASE}]`, lastName);
		}

		return this.readPage(httpParams);
	}

	createUser() {
		const dialogRef = this.dialog.open(AdminUserCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminUser) => {
			if (formValue) {
				this.create(formValue).subscribe(user => {
					this.notificationService.open("New User Created!", 2000);
					this.adminUserStore.add(user);
					this.getPage();
				});
			}
		});
	}

	editUser(user: AdminUser) {
		const dialogRef = this.dialog.open(AdminUserEditComponent, {
			data: { user },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminUser) => {
			if (formValue) {
				this.update(formValue, user.id).subscribe(user => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminUserStore.update(user.id, user);
					this.getPage();
				});
			}
		});
	}

	changePassword(userId: string) {
		const dialogRef = this.dialog.open(AdminUserPasswordChangeComponent, {
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminUserPasswordChange) => {
			if (formValue) {
				const url = this.getUrlWithId(this.entityUrl + "/:id/change-password", userId);
				this.http.post<void>(url, formValue, this.httpOptions).pipe(
					catchError(errorResponse => this.handleError(errorResponse)),
				).subscribe(() => this.notificationService.open("Password Changed!", 2000));
			}
		});
	}

	deleteUser(user: AdminUser) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove user " + user.username + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(user.id).subscribe(() => {
					this.notificationService.open("User Deleted!", 2000);
					this.adminUserStore.remove(user.id);
					this.getPage();
				});
			}
		});
	}

}
