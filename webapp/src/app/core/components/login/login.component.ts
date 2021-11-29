import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AuthenticationService } from "../../state/authentication/authentication.service";

@Component({
	selector: "app-login",
	templateUrl: "./login.component.html",
	styleUrls: ["./login.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
	mouseIn = false;
	hidePassword = true;
	hideVisibilityIcon = true;

	constructor(
		private formBuilder: FormBuilder,
		private authenticationService: AuthenticationService,
		// private store: Store<AppState>,
	) {
	}

	loginForm = this.formBuilder.group({
		username: ["", { validators: [Validators.required] }],
		password: ["", { validators: [Validators.required] }],
	});

	get username() {
		return this.loginForm.get("username") as FormControl;
	}

	get password() {
		return this.loginForm.get("password") as FormControl;
	}

	onSubmit() {
		// this.store.dispatch(
		// 	login({ username: this.username.value, password: this.password.value }),
		// );
		this.authenticationService.login(this.username.value, this.password.value);
	}

	ngOnInit(): void {
	}

}
