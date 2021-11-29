import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminCollege } from "../state/admin-college.model";

@Component({
	selector: "app-admin-college-edit",
	templateUrl: "./admin-college-edit.component.html",
	styleUrls: ["./admin-college-edit.component.scss"],
})
export class AdminCollegeEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminCollegeEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { college: AdminCollege },
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	saveEdit() {
		this.dialogRef.close({
			collegeName: this.collegeName.value,
		});
	}

	collegeForm = this.formBuilder.group({
		collegeName: [this.data.college.collegeName, { validators: [Validators.required, Validators.maxLength(100)] }],
	});

	get collegeName() {
		return this.collegeForm.get("collegeName") as FormControl;
	}

}
