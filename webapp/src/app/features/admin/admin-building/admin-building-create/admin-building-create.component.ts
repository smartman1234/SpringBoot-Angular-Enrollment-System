import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-admin-building-create",
	templateUrl: "./admin-building-create.component.html",
	styleUrls: ["./admin-building-create.component.scss"],
})
export class AdminBuildingCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminBuildingCreateComponent>,
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	create() {
		this.dialogRef.close({
			buildingNumber: this.buildingNumber.value,
			buildingName: this.buildingName.value,
			buildingCode: this.buildingCode.value,
		});
	}

	buildingForm = this.formBuilder.group({
		buildingNumber: ["", { validators: [Validators.required] }],
		buildingName: ["", { validators: [Validators.required, Validators.maxLength(100)] }],
		buildingCode: ["", { validators: [Validators.required, Validators.maxLength(10)] }],
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
