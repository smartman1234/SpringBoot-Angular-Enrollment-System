import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingService } from "../state/loading/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

	constructor(
		private loadingService: LoadingService,
	) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.loadingService.increaseRequest();
		this.loadingService.loadingOn();

		return next.handle(request).pipe(
			finalize(() => {
				this.loadingService.decreaseRequest();
				this.loadingService.loadingOff();
			}),
		);
	}
}
