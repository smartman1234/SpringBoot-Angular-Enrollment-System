import { ChangeDetectionStrategy, Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { AuthenticationUser } from "../../models/authentication-user.model";
import { AuthenticationQuery } from "../../state/authentication/authentication.query";

@Component({
	selector: "app-greeting",
	templateUrl: "./greeting.component.html",
	styleUrls: ["./greeting.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GreetingComponent implements OnInit {

	user$!: Observable<AuthenticationUser>;

	constructor(
		// private store: Store<AppState>,
		private authenticationQuery: AuthenticationQuery,
	) {
	}

	ngOnInit(): void {
		// this.user$ = this.store.pipe(select(selectAuthenticationUser));
		this.user$ = this.authenticationQuery.user$;
	}

}
