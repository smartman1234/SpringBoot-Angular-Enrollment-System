import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminTerm } from "../state/admin-term.model";

@Component({
	selector: "app-admin-term-edit",
	templateUrl: "./admin-term-edit.component.html",
	styleUrls: ["./admin-term-edit.component.scss"],
})
export class AdminTermEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminTermEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { term: AdminTerm },
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.term.id,
			termName: this.termName.value,
			dateStart: this.dateStart.value,
			dateEnd: this.dateEnd.value,
		});
	}

	termForm = this.formBuilder.group({
		termName: [this.data.term.termName, { validators: [Validators.required, Validators.maxLength(50)] }],
		dateStart: [this.data.term.dateStart, { validators: [Validators.required] }],
		dateEnd: [this.data.term.dateEnd, { validators: [Validators.required] }],
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
