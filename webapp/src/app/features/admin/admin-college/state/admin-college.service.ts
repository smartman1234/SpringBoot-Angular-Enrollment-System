import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { AdminCollege } from "./admin-college.model";
import { AdminCollegeStore } from "./admin-college.store";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { EMPTY, Observable } from "rxjs";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { AdminCollegeCreateComponent } from "../admin-college-create/admin-college-create.component";
import { AdminCollegeEditComponent } from "../admin-college-edit/admin-college-edit.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminCollegeService extends AbstractGenericCrudService<AdminCollege, string> {

	constructor(
		protected http: HttpClient,
		private adminCollegeStore: AdminCollegeStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/colleges");
	}

	pageable = {
		...this.defaultPageable,
		sort: ["collegeName"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll() {
		const readAll$ = this.readAll().pipe(tap(entities => {
			this.adminCollegeStore.set(entities);
		}));

		return cacheable(this.adminCollegeStore, readAll$);
	}

	getPage(pageable?: Pageable) {
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } });
		this.readPage(httpParams).pipe(
			tap(collegePage => this.adminCollegeStore.update({ collegePage })),
		).subscribe();
	}

	createCollege() {
		const dialogRef = this.dialog.open(AdminCollegeCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminCollege) => {
			if (formValue) {
				this.create(formValue).subscribe(college => {
					this.notificationService.open("New College Created!", 2000);
					this.adminCollegeStore.add(college);
					this.getPage();
				});
			}
		});
	}

	editCollege(college: AdminCollege) {
		const dialogRef = this.dialog.open(AdminCollegeEditComponent, {
			data: { college },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminCollege) => {
			if (formValue) {
				this.update(formValue, college.id).subscribe(college => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminCollegeStore.update(college.id, college);
					this.getPage();
				});
			}
		});
	}

	deleteCollege(college: AdminCollege) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove college " + college.collegeName + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(college.id).subscribe(() => {
					this.notificationService.open("College Deleted!", 2000);
					this.adminCollegeStore.remove(college.id);
					this.getPage();
				});
			}
		});
	}

}
