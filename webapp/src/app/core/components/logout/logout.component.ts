import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { logout } from "../../store/authentication/authentication.actions";
import { AppState } from "../../../shared/store/app-store.module";

@Component({
	selector: "app-logout",
	templateUrl: "./logout.component.html",
	styleUrls: ["./logout.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutComponent implements OnInit {

	constructor(
		private store: Store<AppState>,
	) {
	}

	onLogout() {
		this.store.dispatch(logout());
	}

	ngOnInit(): void {
	}

}
