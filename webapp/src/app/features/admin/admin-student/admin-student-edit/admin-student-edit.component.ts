import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminStudent } from "../state/admin-student.model";

@Component({
	selector: "app-admin-student-edit",
	templateUrl: "./admin-student-edit.component.html",
	styleUrls: ["./admin-student-edit.component.scss"],
})
export class AdminStudentEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminStudentEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { student: AdminStudent },
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.student.id,
			maxUnit: this.maxUnit.value,
		});
	}

	studentForm = this.formBuilder.group({
		maxUnit: [this.data.student.maxUnit, { validators: [Validators.required, Validators.max(20)] }],
	});

	get maxUnit() {
		return this.studentForm.get("maxUnit") as FormControl;
	}

}
