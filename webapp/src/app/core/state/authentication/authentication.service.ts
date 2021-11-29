import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthenticationStore, initialAuthenticationState } from "./authentication.store";
import { ApiPath } from "../../constants/api-path.enum";
import { environment } from "../../../../environments/environment";
import { Observable, throwError } from "rxjs";
import { AuthenticationUser } from "../../models/authentication-user.model";
import { catchError, tap } from "rxjs/operators";
import { CookieService } from "ngx-cookie";
import { Router } from "@angular/router";
import { ErrorNotificationService } from "../../services/error-notification.service";

@Injectable({ providedIn: "root" })
export class AuthenticationService {

	readonly authApiPath = ApiPath.AUTH;
	readonly csrfUrl = this.authApiPath + "/csrf";
	readonly loginUrl = this.authApiPath + "/login";
	readonly refreshUrl = this.authApiPath + "/refresh";
	readonly logoutUrl = this.authApiPath + "/logout";
	readonly adminLoginUrl = this.authApiPath + "/admin/login";

	readonly homepage = environment.homepage;
	readonly adminHomepage = environment.adminHomepage;
	redirectUrl: string | null = this.homepage;

	httpOptions = {
		headers: new HttpHeaders({ "Content-Type": "application/json" }),
		withCredentials: true,
	};

	constructor(
		private http: HttpClient,
		private authenticationStore: AuthenticationStore,
		private cookieService: CookieService,
		private router: Router,
		private errorNotificationService: ErrorNotificationService,
	) {
	}

	handleError(errorResponse: any): Observable<never> {
		this.errorNotificationService.open(errorResponse);
		return throwError(errorResponse);
	}

	getCsrfToken(): Observable<any> {
		return this.http.get(this.csrfUrl, this.httpOptions);
	}

	login(username: string, password: string) {
		this.http.post<AuthenticationUser>(this.loginUrl, { username, password }, this.httpOptions).pipe(
			tap(authenticationUser => {
				const expiry = Date.now() + Number(this.cookieService.get("REFRESH-TOKEN-TTL")) * 1000;
				this.router.navigate([this.homepage]);
				this.authenticationStore.update({ user: authenticationUser, expiry: expiry });
			}),
			catchError(errorResponse => this.handleError(errorResponse)),
		).subscribe();
	}

	refresh(): Observable<any> {
		return this.http.post(this.refreshUrl, {}, this.httpOptions);
	}

	refreshSuccess(expiry: number) {
		this.authenticationStore.update({ expiry: expiry });
	}

	refreshFailReset() {
		this.authenticationStore.update(initialAuthenticationState());
	}

	logout() {
		this.http.post(this.logoutUrl, {}, this.httpOptions).pipe(
			tap(() => {
				if (this.router.url.includes("admin")) {
					this.router.navigate(["/admin/login"]);
				} else {
					this.router.navigate(["/login"]);
				}
				this.authenticationStore.update(initialAuthenticationState());
			}),
			catchError(errorResponse => this.handleError(errorResponse)),
		).subscribe();
	}

	adminLogin(username: string, password: string, secretKey: string) {
		this.http.post<AuthenticationUser>(
			this.adminLoginUrl,
			{ username, password, secretKey },
			this.httpOptions,
		).pipe(
			tap(authenticationUser => {
				const expiry = Date.now() + Number(this.cookieService.get("REFRESH-TOKEN-TTL")) * 1000;
				this.router.navigate([this.adminHomepage]);
				this.authenticationStore.update({ user: authenticationUser, expiry: expiry });
			}),
			catchError(errorResponse => this.handleError(errorResponse)),
		).subscribe();
	}


}
