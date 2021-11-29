import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	CanActivateChild,
	CanLoad,
	NavigationExtras,
	Route,
	Router,
	RouterStateSnapshot,
	UrlSegment,
	UrlTree,
} from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { take } from "rxjs/operators";
import { ErrorNotificationService } from "../services/error-notification.service";
import { AuthenticationQuery } from "../state/authentication/authentication.query";
import { AuthenticationService } from "../state/authentication/authentication.service";

@Injectable({
	providedIn: "root",
})
export class AuthGuard implements CanActivate, CanActivateChild, CanLoad {

	private homepage = environment.homepage;

	private userExpiry: number = 0;

	constructor(
		private authenticationService: AuthenticationService,
		private authenticationQuery: AuthenticationQuery,
		// private store: Store<AppState>,
		private router: Router,
		private errorNotificationService: ErrorNotificationService,
	) {
	}

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		return this.isLoggedIn(state.url);
	}

	canActivateChild(
		childRoute: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		return this.canActivate(childRoute, state);
	}

	canLoad(
		route: Route,
		segments: UrlSegment[]): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

		const url = "/" + segments.join("/");
		return this.isLoggedIn(url);
	}

	isLoggedIn(url: string): boolean {
		// this.store.pipe(
		// 	select(selectExpiry),
		// 	take(1),
		// ).subscribe(expiry => this.userExpiry = expiry);
		this.authenticationQuery.expiry$.pipe(
			take(1),
		).subscribe(expiry => this.userExpiry = expiry);

		const currentTimeStamp = Date.now();

		// redirect to homepage from login page if already logged in
		if (url.startsWith("/login")) {
			if (currentTimeStamp > this.userExpiry) {
				return true;
			} else {
				this.router.navigate([this.homepage]);
				return false;
			}
		}

		if (currentTimeStamp < this.userExpiry) {
			return true;
		}

		this.authenticationService.redirectUrl = url.split("?")[0].split("(")[0];

		// Set navigation extras with current url for redirecting as query params
		const navigationExtras: NavigationExtras = {
			queryParams: { redirect: this.authenticationService.redirectUrl },
		};

		// Redirect to the login page with extras
		this.errorNotificationService.open(new Error("Please login to continue!"), 2000);
		this.router.navigate(["/login"], navigationExtras);

		return false;
	}
}
