import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";

@Component({
	selector: "app-admin-authority-create",
	templateUrl: "./admin-authority-create.component.html",
	styleUrls: ["./admin-authority-create.component.scss"],
})
export class AdminAuthorityCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminAuthorityCreateComponent>,
		private formBuilder: FormBuilder,
	) {
	}

	ngOnInit(): void {
	}

	create() {
		this.dialogRef.close({
			role: this.role.value,
		});
	}

	authorityForm = this.formBuilder.group({
		role: ["", { validators: [Validators.required] }],
	});

	get role() {
		return this.authorityForm.get("role") as FormControl;
	}

}
