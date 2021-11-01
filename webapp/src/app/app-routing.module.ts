import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { PageNotFoundComponent } from "./core/components/page-not-found/page-not-found.component";
import { AuthGuard } from "./core/guards/auth.guard";

const routes: Routes = [
	{
		path: "admin",
		loadChildren: () => import("./features/admin/admin.module").then(m => m.AdminModule),
		canLoad: [AuthGuard],
	},
	{
		path: "student",
		loadChildren: () => import("./features/student/student.module").then(m => m.StudentModule),
		canLoad: [AuthGuard],
	},
	{ path: "", redirectTo: "/student/dashboard/search", pathMatch: "full" },
	{ path: "**", component: PageNotFoundComponent},
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
	providers:[]
})
export class AppRoutingModule {
}
