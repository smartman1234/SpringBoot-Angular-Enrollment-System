import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-enroll-wait-list-dialog",
	templateUrl: "./enroll-wait-list-dialog.component.html",
	styleUrls: ["./enroll-wait-list-dialog.component.scss"],
})
export class EnrollWaitListDialogComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<EnrollWaitListDialogComponent>,
		private formBuilder: FormBuilder,
	) {
	}

	accessCodeForm = this.formBuilder.group({
		accessCode: ["", { validators: [Validators.required] }],
	});

	get accessCode() {
		return this.accessCodeForm.get("accessCode") as FormControl;
	}

	enrollFromWaitList() {
		this.dialogRef.close(this.accessCode.value);
	}

	ngOnInit(): void {
	}

}
