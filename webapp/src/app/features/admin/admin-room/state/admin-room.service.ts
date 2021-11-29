import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { AdminRoom } from "./admin-room.model";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { EMPTY, Observable } from "rxjs";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { AdminRoomStore } from "./admin-room.store";
import { AdminRoomCreateComponent } from "../admin-room-create/admin-room-create.component";
import { AdminRoomEditComponent } from "../admin-room-edit/admin-room-edit.component";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminRoomService extends AbstractGenericCrudService<AdminRoom, string> {

	constructor(
		protected http: HttpClient,
		private adminRoomStore: AdminRoomStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/rooms");
	}

	buildingNumber: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["roomNumber"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(buildingNumber: string) {
		let httpParams = new HttpParams()
			.append(`building.buildingNumber`, buildingNumber);
		const readAll$ = this.readAll(httpParams).pipe(tap(entities => {
			this.adminRoomStore.set(entities);
		}));

		// return cacheable(this.adminRoomStore, readAll$);
		return readAll$;
	}

	getPage(buildingNumber?: string, pageable?: Pageable) {
		this.buildingNumber = buildingNumber ? buildingNumber : this.buildingNumber;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`building.buildingNumber`, this.buildingNumber);
		this.readPage(httpParams).pipe(
			tap(roomPage => this.adminRoomStore.update({ roomPage })),
		).subscribe();
	}

	createRoom() {
		const dialogRef = this.dialog.open(AdminRoomCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminRoom) => {
			if (formValue) {
				this.create(formValue).subscribe(room => {
					this.notificationService.open("New Room Created!", 2000);
					this.adminRoomStore.add(room);
					this.getPage();
				});
			}
		});
	}

	editRoom(room: AdminRoom) {
		const dialogRef = this.dialog.open(AdminRoomEditComponent, {
			data: { room },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminRoom) => {
			if (formValue) {
				this.update(formValue, room.id).subscribe(room => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminRoomStore.update(room.id, room);
					this.getPage();
				});
			}
		});
	}

	deleteRoom(room: AdminRoom) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: {
					message: "Do you want to remove room Bld." + this.buildingNumber
						+ "-Rm." + room.roomNumber + "?",
				},
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(room.id).subscribe(() => {
					this.notificationService.open("Room Deleted!", 2000);
					this.adminRoomStore.remove(room.id);
					this.getPage();
				});
			}
		});
	}

}
