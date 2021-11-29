import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-admin-college-create",
	templateUrl: "./admin-college-create.component.html",
	styleUrls: ["./admin-college-create.component.scss"],
})
export class AdminCollegeCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminCollegeCreateComponent>,
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	create() {
		this.dialogRef.close({
			collegeName: this.collegeName.value,
		});
	}

	collegeForm = this.formBuilder.group({
		collegeName: ["", { validators: [Validators.required, Validators.maxLength(100)] }],
	});

	get collegeName() {
		return this.collegeForm.get("collegeName") as FormControl;
	}

}
