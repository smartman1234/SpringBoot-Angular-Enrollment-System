import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";

@Injectable()
export class BaseUrlInterceptor implements HttpInterceptor {

	readonly baseUrl = environment.baseUrl;

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// request = request.clone({ url: `${this.baseUrl}${request.url}` })
		request = request.clone({ url: `/api/v1${request.url}` })
		console.log(request.url);
		console.log(request.params.toString());
		return next.handle(request);
	}

}
