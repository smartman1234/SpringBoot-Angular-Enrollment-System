import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminBuildingService } from "../../admin-building/state/admin-building.service";
import { AdminBuildingQuery } from "../../admin-building/state/admin-building.query";
import { Observable } from "rxjs";
import { AdminBuilding } from "../../admin-building/state/admin-building.model";

@Component({
	selector: "app-admin-room-create",
	templateUrl: "./admin-room-create.component.html",
	styleUrls: ["./admin-room-create.component.scss"],
})
export class AdminRoomCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminRoomCreateComponent>,
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

	create() {
		this.dialogRef.close({
			buildingId: this.buildingId.value,
			roomNumber: this.roomNumber.value,
			roomCapacity: this.roomCapacity.value,
		});
	}

	getBuildings() {
		this.adminBuildingService.getAll();
	}

	roomForm = this.formBuilder.group({
		buildingId: ["", { validators: [Validators.required] }],
		roomNumber: ["", { validators: [Validators.required] }],
		roomCapacity: ["", { validators: [Validators.required] }],
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
