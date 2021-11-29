import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./components/login/login.component";
import { AuthGuard } from "./guards/auth.guard";
import { AdminGuard } from "./guards/admin.guard";
import { AdminLoginComponent } from "./components/admin-login/admin-login.component";

const routes: Routes = [
	{ path: "login", component: LoginComponent, canActivate: [AuthGuard] },
	{ path: "admin/login", component: AdminLoginComponent, canActivate: [AdminGuard] },
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class CoreRoutingModule {
}
