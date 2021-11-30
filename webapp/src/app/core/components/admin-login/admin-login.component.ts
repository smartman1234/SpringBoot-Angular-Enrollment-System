import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AuthenticationService } from "../../state/authentication/authentication.service";

@Component({
	selector: "app-admin-login",
	templateUrl: "./admin-login.component.html",
	styleUrls: ["./admin-login.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminLoginComponent implements OnInit {
	mouseIn = false;
	hidePassword = true;
	hideVisibilityIcon = true;

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
	) {
	}

	loginForm = this.formBuilder.group({
		username: ["", { validators: [Validators.required] }],
		password: ["", { validators: [Validators.required] }],
		secretKey: ["", { validators: [Validators.required] }],
	});

	get username() {
		return this.loginForm.get("username") as FormControl;
	}

	get password() {
		return this.loginForm.get("password") as FormControl;
	}

	get secretKey() {
		return this.loginForm.get("secretKey") as FormControl;
	}

	onSubmit() {
		this.authenticationService.adminLogin(this.username.value, this.password.value, this.secretKey.value);
	}

	ngOnInit(): void {
	}

}
