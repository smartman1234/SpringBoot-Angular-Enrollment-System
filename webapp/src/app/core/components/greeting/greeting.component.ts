import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { AuthenticationUser } from "../../models/authentication-user.model";
import { AppState } from "../../../shared/store/app-store.module";
import { selectAuthenticationUser } from "../../store/authentication/authentication.selectors";

@Component({
	selector: "app-greeting",
	templateUrl: "./greeting.component.html",
	styleUrls: ["./greeting.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingComponent implements OnInit {

	user$: Observable<AuthenticationUser> = this.store.pipe(select(selectAuthenticationUser));

	constructor(
		private store: Store<AppState>,
	) {
	}

	ngOnInit(): void {
	}

}
