import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import {
	AbstractControl,
	FormBuilder,
	FormControl,
	FormGroup,
	FormGroupDirective,
	NgForm,
	Validators,
} from "@angular/forms";
import { AdminAuthorityService } from "../../admin-authority/state/admin-authority.service";
import { AdminAuthorityQuery } from "../../admin-authority/state/admin-authority.query";
import { Observable } from "rxjs";
import { AdminAuthority } from "../../admin-authority/state/admin-authority.model";
import { ErrorStateMatcher } from "@angular/material/core";
import { PasswordConfirmationMatcher, passwordConfirmMatch } from "../password-confirm-validator";

@Component({
	selector: "app-admin-user-create",
	templateUrl: "./admin-user-create.component.html",
	styleUrls: ["./admin-user-create.component.scss"],
})
export class AdminUserCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminUserCreateComponent>,
		private formBuilder: FormBuilder,
		private adminAuthorityService: AdminAuthorityService,
		private adminAuthorityQuery: AdminAuthorityQuery,
	) {
	}

	mouseIn = false;
	hidePassword = true;
	hideVisibilityIcon = true;
	matcher = new PasswordConfirmationMatcher("password", "passwordConfirm");

	authorities$!: Observable<AdminAuthority[]>;

	ngOnInit(): void {
		this.authorities$ = this.adminAuthorityQuery.adminAuthorities$;
		this.getAuthorities();
	}

	create() {
		this.dialogRef.close({
			authorities: this.authorities.value.map((role: string) => ({
				role: role,
			})),
			username: this.username.value,
			password: this.password.value,
			enabled: this.enabled.value,
			firstName: this.firstName.value,
			lastName: this.lastName.value,
		});
	}

	getAuthorities() {
		this.adminAuthorityService.getAll();
	}

	userForm = this.formBuilder.group({
		authorities: ["", { validators: [Validators.required] }],
		username: ["", { validators: [Validators.required] }],
		password: ["", { validators: [Validators.required] }],
		passwordConfirm: ["", { validators: [Validators.required] }],
		enabled: [true, { validators: [Validators.required] }],
		firstName: ["", { validators: [Validators.required] }],
		lastName: ["", { validators: [Validators.required] }],
	}, { validators: this.passwordMatchValidator });

	passwordMatchValidator(formGroup: FormGroup) {
		return passwordConfirmMatch(formGroup, "password", "passwordConfirm")
			? null : { "mismatch": true };
	}

	get username() {
		return this.userForm.get("username") as FormControl;
	}

	get password() {
		return this.userForm.get("password") as FormControl;
	}

	get passwordConfirm() {
		return this.userForm.get("passwordConfirm") as FormControl;
	}

	get enabled() {
		return this.userForm.get("enabled") as FormControl;
	}

	get firstName() {
		return this.userForm.get("firstName") as FormControl;
	}

	get lastName() {
		return this.userForm.get("lastName") as FormControl;
	}

	get authorities() {
		return this.userForm.get("authorities") as FormControl;
	}

}
