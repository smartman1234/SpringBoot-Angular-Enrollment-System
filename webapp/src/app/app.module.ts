import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { CookieModule } from "ngx-cookie";
import { httpInterceptorProviders } from "./core/interceptors";
import { CoreModule } from "./core/core.module";
import { AppStoreModule } from "./shared/store/app-store.module";
import { HttpClientModule } from "@angular/common/http";
import { MaterialModule } from "./shared/module/material.module";

@NgModule({
	declarations: [
		AppComponent,
	],
	imports: [
		BrowserModule,
		HttpClientModule,
		BrowserAnimationsModule,
		MaterialModule,
		CookieModule.forRoot(),
		AppStoreModule,
		CoreModule,
		AppRoutingModule,
	],
	providers: [
		httpInterceptorProviders,
	],
	bootstrap: [AppComponent],
})
export class AppModule {
}
