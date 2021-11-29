import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { CookieService } from "ngx-cookie";
import { catchError, filter, finalize, switchMap } from "rxjs/operators";
import { Router } from "@angular/router";
import { ErrorNotificationService } from "../services/error-notification.service";
import { AuthenticationService } from "../state/authentication/authentication.service";
import { LoadingService } from "../state/loading/loading.service";

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {

	private isRefreshTokenProcessing = false;
	private isTokenRefreshedSubject = new BehaviorSubject<boolean>(false);

	constructor(
		private cookieService: CookieService,
		private authenticationService: AuthenticationService,
		private loadingService: LoadingService,
		private errorNotificationService: ErrorNotificationService,
		private router: Router,
		// private store: Store,
	) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// skip intercepting for 'refresh' and 'login' requests
		if (request.url.includes("refresh") || request.url.includes("login")) {
			return next.handle(request);
		}

		return next.handle(request).pipe(
			catchError(errorResponse => {
				if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 401) {
					return this.handle401Error(request, next);
				} else {
					return throwError(errorResponse);
				}
			}),
		);
	}

	private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (!this.isRefreshTokenProcessing) {
			this.isRefreshTokenProcessing = true;
			this.isTokenRefreshedSubject.next(false);

			return this.authenticationService.refresh().pipe(
				switchMap(() => {
					let expiry = Date.now() + Number(this.cookieService.get("REFRESH-TOKEN-TTL")) * 1000;
					// this.store.dispatch(refreshSuccess({ expiry }));
					this.authenticationService.refreshSuccess(expiry);

					// Upon successful token refreshing, Spring security issues new XSRF-TOKEN cookie as replacement.
					// Angular will not set new XSRF-TOKEN cookie on request header automatically
					// this new cookie token needs to be set manually
					const headerName = "X-XSRF-TOKEN";
					const cookieName = "XSRF-TOKEN";
					const cookieToken = this.cookieService.get(cookieName);
					request = request.clone({ headers: request.headers.set(headerName, cookieToken) });

					this.isTokenRefreshedSubject.next(true);
					return next.handle(request);
				}),
				catchError(errorResponse => {
					if (errorResponse instanceof HttpErrorResponse && errorResponse.status === 401) {
						// this.store.dispatch(refreshFailReset());
						this.authenticationService.refreshFailReset();
						this.authenticationService.redirectUrl = this.router.url
							.split("?")[0]
							.split("(")[0];
						this.errorNotificationService.open(new Error("Please login to continue!"), 2000);
						if (this.router.url.includes("admin")) {
							this.router.navigate(["/admin/login"]);
						} else {
							this.router.navigate(["/login"]);
						}
					}

					return throwError(errorResponse);
				}),
				finalize(() => {
					// this.store.dispatch(decreaseRequest());
					// this.store.dispatch(loadingOff());
					this.loadingService.decreaseRequest();
					this.loadingService.loadingOff();
					this.isRefreshTokenProcessing = false;
				}),
			);
		} else {
			return this.isTokenRefreshedSubject.pipe(
				filter(isRefreshed => isRefreshed),
				switchMap(() => {
					return next.handle(request);
				}),
			);
		}
	}

}
