import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-admin-term-create",
	templateUrl: "./admin-term-create.component.html",
	styleUrls: ["./admin-term-create.component.scss"],
})
export class AdminTermCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminTermCreateComponent>,
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	create() {
		this.dialogRef.close({
			termName: this.dateStart.value,
			dateStart: this.termName.value,
			dateEnd: this.dateEnd.value,
		});
	}

	termForm = this.formBuilder.group({
		termName: ["", { validators: [Validators.required, Validators.maxLength(50)] }],
		dateStart: ["", { validators: [Validators.required] }],
		dateEnd: ["", { validators: [Validators.required] }],
	});

	get termName() {
		return this.termForm.get("termName") as FormControl;
	}

	get dateStart() {
		return this.termForm.get("dateStart") as FormControl;
	}

	get dateEnd() {
		return this.termForm.get("dateEnd") as FormControl;
	}
}
