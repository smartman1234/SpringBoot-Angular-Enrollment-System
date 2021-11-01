import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { BehaviorSubject, Observable, throwError } from "rxjs";
import { CookieService } from "ngx-cookie";
import { AuthenticationService } from "../services/authentication.service";
import { catchError, filter, finalize, switchMap } from "rxjs/operators";

@Injectable()
export class CsrfInterceptor implements HttpInterceptor {

	private isCsrfProcessing = false;
	private isCsrfProcessedSubject = new BehaviorSubject<boolean>(false);

	constructor(
		private cookieService: CookieService,
		private authenticationService: AuthenticationService,
	) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

		if (request.method !== "GET") {
			let xsrfToken = this.cookieService.get("XSRF-TOKEN");

			if (xsrfToken == null || xsrfToken.length === 0 || xsrfToken === "") {
				return this.handleMissingCsrfToken(request, next);
			}
		}

		return next.handle(request);
	}

	private handleMissingCsrfToken(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		if (!this.isCsrfProcessing) {
			this.isCsrfProcessing = true;
			this.isCsrfProcessedSubject.next(false);

			return this.authenticationService.getCsrfToken().pipe(
				switchMap(() => {
					const headerName = "X-XSRF-TOKEN";
					const cookieName = "XSRF-TOKEN";
					const cookieToken = this.cookieService.get(cookieName);
					request = request.clone({ headers: request.headers.set(headerName, cookieToken) });

					this.isCsrfProcessedSubject.next(true);
					return next.handle(request);
				}),
				catchError(errorResponse => {
					return throwError(errorResponse);
				}),
				finalize(() => {
					this.isCsrfProcessing = false;
				}),
			);
		} else {
			return this.isCsrfProcessedSubject.pipe(
				filter(isRefreshed => isRefreshed),
				switchMap(() => {
					return next.handle(request);
				}),
			);
		}
	}

}
