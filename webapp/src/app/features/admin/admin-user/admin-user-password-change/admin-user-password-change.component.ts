import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { PasswordConfirmationMatcher, passwordConfirmMatch } from "../password-confirm-validator";

@Component({
	selector: "app-admin-user-password-change",
	templateUrl: "./admin-user-password-change.component.html",
	styleUrls: ["./admin-user-password-change.component.scss"],
})
export class AdminUserPasswordChangeComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminUserPasswordChangeComponent>,
		private formBuilder: FormBuilder,
	) {
	}

	mouseIn = false;
	hidePassword = true;
	hideVisibilityIcon = true;

	mouseIn2 = false;
	hidePassword2 = true;
	hideVisibilityIcon2 = true;
	matcher = new PasswordConfirmationMatcher("newPassword", "newPasswordConfirm");

	ngOnInit(): void {
	}

	create() {
		this.dialogRef.close({
			currentPassword: this.currentPassword.value,
			newPassword: this.newPassword.value,
		});
	}

	passwordForm = this.formBuilder.group({
		currentPassword: ["", { validators: [Validators.required] }],
		newPassword: ["", { validators: [Validators.required] }],
		newPasswordConfirm: ["", { validators: [Validators.required] }],
	}, { validators: this.newPasswordMatchValidator });

	newPasswordMatchValidator(formGroup: FormGroup) {
		return passwordConfirmMatch(formGroup, "newPassword", "newPasswordConfirm")
			? null : { "mismatch": true };
	}

	get currentPassword() {
		return this.passwordForm.get("currentPassword") as FormControl;
	}

	get newPassword() {
		return this.passwordForm.get("newPassword") as FormControl;
	}

	get newPasswordConfirm() {
		return this.passwordForm.get("newPasswordConfirm") as FormControl;
	}

}
