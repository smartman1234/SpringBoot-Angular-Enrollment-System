import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminBuildingService } from "../../admin-building/state/admin-building.service";
import { AdminBuildingQuery } from "../../admin-building/state/admin-building.query";
import { Observable } from "rxjs";
import { AdminBuilding } from "../../admin-building/state/admin-building.model";
import { AdminRoom } from "../state/admin-room.model";

@Component({
	selector: "app-admin-room-edit",
	templateUrl: "./admin-room-edit.component.html",
	styleUrls: ["./admin-room-edit.component.scss"],
})
export class AdminRoomEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminRoomEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { room: AdminRoom },
		private formBuilder: FormBuilder,
		private adminBuildingService: AdminBuildingService,
		private adminBuildingQuery: AdminBuildingQuery,
	) {
	}

	buildings$!: Observable<AdminBuilding[]>;

	ngOnInit(): void {
		this.buildings$ = this.adminBuildingQuery.adminBuildings$;
		this.getBuildings();
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.room.id,
			buildingId: this.buildingId.value,
			roomNumber: this.roomNumber.value,
			roomCapacity: this.roomCapacity.value,
		});
	}

	getBuildings() {
		this.adminBuildingService.getAll();
	}

	roomForm = this.formBuilder.group({
		buildingId: [this.data.room.buildingId, { validators: [Validators.required] }],
		roomNumber: [this.data.room.roomNumber, { validators: [Validators.required] }],
		roomCapacity: [this.data.room.roomCapacity, { validators: [Validators.required] }],
	});

	get roomNumber() {
		return this.roomForm.get("roomNumber") as FormControl;
	}

	get roomCapacity() {
		return this.roomForm.get("roomCapacity") as FormControl;
	}

	get buildingId() {
		return this.roomForm.get("buildingId") as FormControl;
	}

}
