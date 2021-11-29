import { NgModule } from "@angular/core";

import { CoreRoutingModule } from "./core-routing.module";
import { GreetingComponent } from "./components/greeting/greeting.component";
import { PageNotFoundComponent } from "./components/page-not-found/page-not-found.component";
import { SharedModule } from "../shared/module/shared.module";
import { LogoutComponent } from "./components/logout/logout.component";
import { LoginComponent } from "./components/login/login.component";
import { LoadingComponent } from "./components/loading/loading.component";
import { ConfirmDialogComponent } from "./components/confirm-dialog/confirm-dialog.component";
import { MatchMediaPipe } from "./pipes/match-media.pipe";
import { CoreStoreModule } from "./store/core-store.module";
import { NavigationBarComponent } from "./components/navigation-bar/navigation-bar.component";
import { VarDirective } from "./directives/var.directive";
import { LoadingPipe } from "./pipes/loading.pipe";
import { PaginatorComponent } from "./components/paginator/paginator.component";
import { ErrorMessageDialogComponent } from "./components/error-message-dialog/error-message-dialog.component";
import { AdminLoginComponent } from "./components/admin-login/admin-login.component";
import { EmptyResultComponent } from "./components/empty-result/empty-result.component";

@NgModule({
	declarations: [
		GreetingComponent,
		PageNotFoundComponent,
		AdminLoginComponent,
		LoginComponent,
		LogoutComponent,
		LoadingComponent,
		ConfirmDialogComponent,
		NavigationBarComponent,
		ErrorMessageDialogComponent,
		EmptyResultComponent,
		PaginatorComponent,
		VarDirective,
		MatchMediaPipe,
		LoadingPipe,
	],
	imports: [
		SharedModule,
		// CoreStoreModule,
		CoreRoutingModule,
	],
	exports: [
		LogoutComponent,
		LoadingComponent,
		GreetingComponent,
		PageNotFoundComponent,
		NavigationBarComponent,
		ErrorMessageDialogComponent,
		EmptyResultComponent,
		PaginatorComponent,
		VarDirective,
		MatchMediaPipe,
		LoadingPipe,
	],
})
export class CoreModule {
}
