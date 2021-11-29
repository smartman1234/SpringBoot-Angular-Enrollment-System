import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { LoadingService } from "../state/loading/loading.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

	constructor(
		// private store: Store<AppState>,
		private loadingService: LoadingService,
	) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		// this.store.dispatch(increaseRequest());
		// this.store.dispatch(loadingOn());
		this.loadingService.increaseRequest();
		this.loadingService.loadingOn();

		return next.handle(request).pipe(
			finalize(() => {
				// this.store.dispatch(decreaseRequest());
				// this.store.dispatch(loadingOff());
				this.loadingService.decreaseRequest();
				this.loadingService.loadingOff();
			}),
		);
	}
}
