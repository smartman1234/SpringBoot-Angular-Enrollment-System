import { Injectable } from "@angular/core";
import { HttpClient, HttpErrorResponse, HttpHeaders } from "@angular/common/http";
import { catchError } from "rxjs/operators";
import { Observable, throwError } from "rxjs";
import { AuthenticationUser } from "../models/authentication-user.model";
import { ApiPath } from "../constants/api-path.enum";
import { environment } from "../../../environments/environment";

@Injectable({
	providedIn: "root",
})
export class AuthenticationService {

	readonly authApiPath = ApiPath.AUTH;
	readonly csrfUrl = this.authApiPath + "/csrf";
	readonly loginUrl = this.authApiPath + "/login";
	readonly refreshUrl = this.authApiPath + "/refresh";
	readonly logoutUrl = this.authApiPath + "/logout";
	readonly loadingUrls = {
		csrfUrl: "GET" + this.csrfUrl,
		loginUrl: "POST" + this.loginUrl,
		refreshUrl: "POST" + this.refreshUrl,
		logoutUrl: "POST" + this.logoutUrl,
	}

	readonly homepage = environment.homepage;
	redirectUrl: string | null = this.homepage;

	httpOptions = {
		headers: new HttpHeaders({ "Content-Type": "application/json" }),
		withCredentials: true,
	};

	constructor(private http: HttpClient) {
	}

	getCsrfToken(): Observable<any> {
		return this.http.get(this.csrfUrl, this.httpOptions);
	}

	login(username: string, password: string): Observable<AuthenticationUser> {
		return this.http.post<AuthenticationUser>(this.loginUrl, { username, password }, this.httpOptions);
	}

	refresh(): Observable<any> {
		return this.http.post(this.refreshUrl, {}, this.httpOptions);
	}

	logout(): Observable<any> {
		return this.http.post(this.logoutUrl, {}, this.httpOptions);
	}
}
