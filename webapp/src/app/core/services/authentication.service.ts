import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs";
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
	readonly adminLoginUrl = this.authApiPath + "/admin/login";

	readonly homepage = environment.homepage;
	readonly adminHomepage = environment.adminHomepage;
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

	adminLogin(username: string, password: string, secretKey: string): Observable<AuthenticationUser> {
		return this.http.post<AuthenticationUser>(
			this.adminLoginUrl,
			{ username, password, secretKey },
			this.httpOptions
		);
	}
}
