import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { cacheable } from "@datorama/akita";
import { tap } from "rxjs/operators";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { EMPTY, Observable } from "rxjs";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminBuilding } from "./admin-building.model";
import { AdminBuildingStore } from "./admin-building.store";
import { AdminBuildingCreateComponent } from "../admin-building-create/admin-building-create.component";
import { AdminBuildingEditComponent } from "../admin-building-edit/admin-building-edit.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminBuildingService extends AbstractGenericCrudService<AdminBuilding, string> {

	constructor(
		protected http: HttpClient,
		private adminBuildingStore: AdminBuildingStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/buildings");
	}

	pageable = {
		...this.defaultPageable,
		sort: ["buildingNumber"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll() {
		const readAll$ = this.readAll().pipe(tap(entities => {
			this.adminBuildingStore.set(entities);
		}));

		return cacheable(this.adminBuildingStore, readAll$);
	}

	getPage(pageable?: Pageable) {
		this.pageable = { ...this.pageable, ...pageable };
		let httpParams = new HttpParams({ fromObject: { ...this.pageable } });

		this.readPage(httpParams).pipe(
			tap(buildingPage => this.adminBuildingStore.update({ buildingPage })),
		).subscribe();
	}

	createBuilding() {
		const dialogRef = this.dialog.open(AdminBuildingCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminBuilding) => {
			if (formValue) {
				this.create(formValue).subscribe(building => {
					this.notificationService.open("New Building Created!", 2000);
					this.adminBuildingStore.add(building);
					this.getPage();
				});
			}
		});
	}

	editBuilding(building: AdminBuilding) {
		const dialogRef = this.dialog.open(AdminBuildingEditComponent, {
			data: { building },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminBuilding) => {
			if (formValue) {
				this.update(formValue, building.id).subscribe(building => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminBuildingStore.update(building.id, building);
					this.getPage();
				});
			}
		});
	}

	deleteBuilding(building: AdminBuilding) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove building " + building.buildingName + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(building.id).subscribe(() => {
					this.notificationService.open("Building Deleted!", 2000);
					this.adminBuildingStore.remove(building.id);
					this.getPage();
				});
			}
		});
	}

}
