import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { AuthenticationService } from "../../state/authentication/authentication.service";

@Component({
	selector: "app-logout",
	templateUrl: "./logout.component.html",
	styleUrls: ["./logout.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {

	constructor(
		private authenticationService: AuthenticationService,
	) {
	}

	onLogout() {
		this.authenticationService.logout();
	}

	ngOnInit(): void {
	}

}
