// import { Injectable } from "@angular/core";
// import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
// import { Observable } from "rxjs";
// import { finalize } from "rxjs/operators";
// import { LoadingService } from "../services/loading.service";
//
// @Injectable()
// export class LoadingInterceptor implements HttpInterceptor {
//
// 	constructor(
// 		private loadingService: LoadingService,
// 	) {
// 	}
//
// 	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
// 		this.loadingService.increaseTotalRequest();
// 		this.loadingService.loadingOn();
//
// 		return next.handle(request).pipe(
// 			finalize(() => {
// 				this.loadingService.decreaseTotalRequest();
// 				if (this.loadingService.totalRequest === 0) {
// 					this.loadingService.loadingOff();
// 				}
// 			}),
// 		);
// 	}
// }

import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { finalize } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../../shared/store/app-store.module";
import { decreaseRequest, increaseRequest, loadingOff, loadingOn } from "../store/loading/loading.actions";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

	constructor(
		private store: Store<AppState>,
	) {
	}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		this.store.dispatch(increaseRequest());
		this.store.dispatch(loadingOn());

		return next.handle(request).pipe(
			finalize(() => {
				this.store.dispatch(decreaseRequest());
				this.store.dispatch(loadingOff());
			}),
		);
	}
}
