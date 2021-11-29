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
import { ErrorNotificationService } from "../services/error-notification.service";
import { environment } from "../../../environments/environment";
import { take } from "rxjs/operators";
import { Authority } from "../models/authority.model";
import { AuthenticationService } from "../state/authentication/authentication.service";
import { AuthenticationQuery } from "../state/authentication/authentication.query";

@Injectable({
	providedIn: "root",
})
export class AdminGuard implements CanActivate, CanActivateChild, CanLoad {

	private adminRole = "ROLE_ADMIN";
	private adminHomepage = environment.adminHomepage;
	private userExpiry: number = 0;
	private authorities: Array<Authority> = [];

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

		return this.isAdmin(state.url);
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
		return this.isAdmin(url);
	}

	isAdmin(url: string): boolean {
		// this.store.pipe(
		// 	select(selectExpiry),
		// 	take(1),
		// ).subscribe(expiry => this.userExpiry = expiry);
		//
		// this.store.pipe(
		// 	select(selectAuthorities),
		// 	take(1),
		// ).subscribe(authorities => this.authorities = authorities);

		this.authenticationQuery.expiry$.pipe(
			take(1),
		).subscribe(expiry => this.userExpiry = expiry);

		this.authenticationQuery.authorities$.pipe(
			take(1),
		).subscribe(authorities => this.authorities = authorities);

		const currentTimeStamp = Date.now();

		// redirect to homepage from login page if already logged in
		if (url.startsWith("/admin/login")) {
			if (currentTimeStamp > this.userExpiry
				|| this.authorities == null || !this.authorities.some(authority => authority.role === this.adminRole)) {
				return true;
			} else {
				this.router.navigate([this.adminHomepage]);
				return false;
			}
		}

		if (currentTimeStamp < this.userExpiry
			&& this.authorities && this.authorities.some(authority => authority.role === this.adminRole)) {
			return true;
		}

		this.authenticationService.redirectUrl = url.split("?")[0].split("(")[0];

		// Set navigation extras with current url for redirecting as query params
		const navigationExtras: NavigationExtras = {
			queryParams: { redirect: this.authenticationService.redirectUrl },
		};

		// Redirect to the login page with extras
		this.errorNotificationService.open(new Error("Please login to continue!"), 2000);
		this.router.navigate(["/admin/login"], navigationExtras);

		return false;
	}
}
