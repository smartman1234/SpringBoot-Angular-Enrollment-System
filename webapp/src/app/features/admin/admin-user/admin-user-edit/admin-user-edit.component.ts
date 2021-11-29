import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { AdminUser } from "../state/admin-user.model";
import { AdminAuthority } from "../../admin-authority/state/admin-authority.model";
import { AdminAuthorityService } from "../../admin-authority/state/admin-authority.service";
import { AdminAuthorityQuery } from "../../admin-authority/state/admin-authority.query";

@Component({
	selector: "app-admin-user-edit",
	templateUrl: "./admin-user-edit.component.html",
	styleUrls: ["./admin-user-edit.component.scss"],
})
export class AdminUserEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminUserEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { user: AdminUser },
		private formBuilder: FormBuilder,
		private adminAuthorityService: AdminAuthorityService,
		private adminAuthorityQuery: AdminAuthorityQuery,
	) {
	}

	authorities$!: Observable<AdminAuthority[]>;

	ngOnInit(): void {
		this.authorities$ = this.adminAuthorityQuery.adminAuthorities$;
		this.getAuthorities();
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.user.id,
			authorities: this.authorities.value.map((role: string) => ({
				role: role
			})),
			username: this.username.value,
			enabled: this.enabled.value,
			firstName: this.firstName.value,
			lastName: this.lastName.value,
		});
	}

	getAuthorities() {
		this.adminAuthorityService.getAll();
	}

	userForm = this.formBuilder.group({
		authorities: [this.data.user.authorities.map(authority => authority.role), { validators: [Validators.required] }],
		username: [this.data.user.username, { validators: [Validators.required] }],
		enabled: [this.data.user.enabled, { validators: [Validators.required] }],
		firstName: [this.data.user.firstName, { validators: [Validators.required] }],
		lastName: [this.data.user.lastName, { validators: [Validators.required] }],
	});

	get username() {
		return this.userForm.get("username") as FormControl;
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
