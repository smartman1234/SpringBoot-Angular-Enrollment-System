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

@NgModule({
	declarations: [
		GreetingComponent,
		PageNotFoundComponent,
		LoginComponent,
		LogoutComponent,
		LoadingComponent,
		ConfirmDialogComponent,
		NavigationBarComponent,
		PaginatorComponent,
		MatchMediaPipe,
		VarDirective,
		LoadingPipe,
	],
	imports: [
		SharedModule,
		CoreStoreModule,
		CoreRoutingModule,
	],
	exports: [
		LogoutComponent,
		LoadingComponent,
		GreetingComponent,
		PageNotFoundComponent,
		NavigationBarComponent,
		PaginatorComponent,
		MatchMediaPipe,
		VarDirective,
		LoadingPipe,
	],
})
export class CoreModule {
}
