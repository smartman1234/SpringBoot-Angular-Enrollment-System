import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { EMPTY, Observable } from "rxjs";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminTermStore } from "./admin-term.store";
import { AdminTerm } from "./admin-term.model";
import { AdminTermCreateComponent } from "../admin-term-create/admin-term-create.component";
import { AdminTermEditComponent } from "../admin-term-edit/admin-term-edit.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminTermService extends AbstractGenericCrudService<AdminTerm, string> {

	constructor(
		protected http: HttpClient,
		private adminTermStore: AdminTermStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/terms");
	}

	pageable = {
		...this.defaultPageable,
		sort: ["dateStart"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll() {
		const readAll$ = this.readAll().pipe(tap(entities => {
			this.adminTermStore.set(entities);
		}));

		return cacheable(this.adminTermStore, readAll$);
	}

	getPage(pageable?: Pageable) {
		this.pageable = { ...this.pageable, ...pageable };
		let httpParams = new HttpParams({ fromObject: { ...this.pageable } });

		this.readPage(httpParams).pipe(
			tap(termPage => this.adminTermStore.update({ termPage })),
		).subscribe();
	}

	createTerm() {
		const dialogRef = this.dialog.open(AdminTermCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminTerm) => {
			if (formValue) {
				this.create(formValue).subscribe(term => {
					this.notificationService.open("New Term Created!", 2000);
					this.adminTermStore.add(term);
					this.getPage();
				});
			}
		});
	}

	editTerm(term: AdminTerm) {
		const dialogRef = this.dialog.open(AdminTermEditComponent, {
			data: { term },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminTerm) => {
			if (formValue) {
				this.update(formValue, term.id).subscribe(term => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminTermStore.update(term.id, term);
					this.getPage();
				});
			}
		});
	}

	deleteTerm(term: AdminTerm) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove term " + term.termName + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(term.id).subscribe(() => {
					this.notificationService.open("Term Deleted!", 2000);
					this.adminTermStore.remove(term.id);
					this.getPage();
				});
			}
		});
	}

}
