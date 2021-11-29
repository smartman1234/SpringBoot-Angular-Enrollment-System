import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminEnrollment } from "../state/admin-enrollment.model";
import { EnrollmentStatus } from "../../../../core/constants/enrollment-status";

@Component({
	selector: "app-admin-enrollment-edit",
	templateUrl: "./admin-enrollment-edit.component.html",
	styleUrls: ["./admin-enrollment-edit.component.scss"],
})
export class AdminEnrollmentEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminEnrollmentEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { enrollment: AdminEnrollment },
		private formBuilder: FormBuilder,
	) {
	}

	inCart: boolean = false;

	ngOnInit(): void {
		if (this.data.enrollment.enrollmentStatus === EnrollmentStatus.ON_WAIT_LIST) {
			this.accessCode.enable();
		} else if (this.data.enrollment.enrollmentStatus === EnrollmentStatus.IN_CART) {
			this.inCart = true;
		}
	}

	saveEdit() {
		this.dialogRef.close({
			accessCode: this.accessCode.value,
		});
	}

	enrollmentForm = this.formBuilder.group({
		accessCode: [{ value: "", disabled: true }, { validators: [Validators.required] }],
	});

	get accessCode() {
		return this.enrollmentForm.get("accessCode") as FormControl;
	}

}
