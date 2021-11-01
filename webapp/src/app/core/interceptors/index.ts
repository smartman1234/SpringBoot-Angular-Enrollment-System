/** Http interceptor providers in outside-in order */
import { HTTP_INTERCEPTORS } from "@angular/common/http";
import { RefreshTokenInterceptor } from "./refresh-token.interceptor";
import { BaseUrlInterceptor } from "./base-url.interceptor";
import { CsrfInterceptor } from "./csrf.interceptor";
import { LoadingInterceptor } from "./loading.interceptor";

export const httpInterceptorProviders = [
	{ provide: HTTP_INTERCEPTORS, useClass: BaseUrlInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: LoadingInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: CsrfInterceptor, multi: true },
	{ provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
];
