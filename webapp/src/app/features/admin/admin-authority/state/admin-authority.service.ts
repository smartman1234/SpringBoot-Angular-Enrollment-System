import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { EMPTY, Observable, timer } from "rxjs";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminAuthorityStore } from "./admin-authority.store";
import { AdminAuthority } from "./admin-authority.model";
import { AdminAuthorityEditComponent } from "../admin-authority-edit/admin-authority-edit.component";
import { AdminAuthorityCreateComponent } from "../admin-authority-create/admin-authority-create.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminAuthorityService extends AbstractGenericCrudService<AdminAuthority, string> {

	constructor(
		protected http: HttpClient,
		private adminAuthorityStore: AdminAuthorityStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/authorities");
	}

	pageable = {
		...this.defaultPageable,
		sort: ["role"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll() {
		const readAll$ = this.readAll().pipe(tap(entities => {
			this.adminAuthorityStore.set(entities);
		}));

		return cacheable(this.adminAuthorityStore, readAll$);
	}

	getPage(pageable?: Pageable) {
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } });
		this.readPage(httpParams).pipe(
			tap(authorityPage => this.adminAuthorityStore.update({ authorityPage })),
		).subscribe();
	}

	createAuthority() {
		const dialogRef = this.dialog.open(AdminAuthorityCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminAuthority) => {
			if (formValue) {
				this.create(formValue).subscribe(authority => {
					this.notificationService.open("New Authority Created!", 2000);
					this.adminAuthorityStore.add(authority);
					this.getPage();
				});
			}
		});
	}

	editAuthority(authority: AdminAuthority) {
		const dialogRef = this.dialog.open(AdminAuthorityEditComponent, {
			data: { authority: authority },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminAuthority) => {
			if (formValue) {
				this.update(formValue, authority.id).subscribe(authority => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminAuthorityStore.update(authority.id, authority);
					this.getPage();
				});
			}
		});
	}

	deleteAuthority(authority: AdminAuthority) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove authority " + authority.role + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(authority.id).subscribe(() => {
					this.notificationService.open("Authority Deleted!", 2000);
					this.adminAuthorityStore.remove(authority.id);
					this.getPage();
				});
			}
		});
	}

}
