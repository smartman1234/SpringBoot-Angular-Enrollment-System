import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminBuilding } from "../state/admin-building.model";

@Component({
	selector: "app-admin-building-edit",
	templateUrl: "./admin-building-edit.component.html",
	styleUrls: ["./admin-building-edit.component.scss"],
})
export class AdminBuildingEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminBuildingEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { building: AdminBuilding },
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.building.id,
			buildingNumber: this.buildingNumber.value,
			buildingName: this.buildingName.value,
			buildingCode: this.buildingCode.value,
		});
	}

	buildingForm = this.formBuilder.group({
		buildingNumber: [this.data.building.buildingNumber, { validators: [Validators.required] }],
		buildingName: [this.data.building.buildingName, { validators: [Validators.required, Validators.maxLength(100)] }],
		buildingCode: [this.data.building.buildingCode, { validators: [Validators.required, Validators.maxLength(10)] }],
	});

	get buildingNumber() {
		return this.buildingForm.get("buildingNumber") as FormControl;
	}

	get buildingName() {
		return this.buildingForm.get("buildingName") as FormControl;
	}

	get buildingCode() {
		return this.buildingForm.get("buildingCode") as FormControl;
	}

}
