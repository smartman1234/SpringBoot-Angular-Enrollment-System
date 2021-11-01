import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DashboardComponent } from "./components/dashboard/dashboard.component";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PageNotFoundComponent } from "../../core/components/page-not-found/page-not-found.component";
import { SearchComponent } from "./components/search/search.component";
import { ScheduleComponent } from "./components/schedule/schedule.component";
import { ProfileComponent } from "./components/profile/profile.component";
import { ShoppingCartComponent } from "./components/shopping-cart/shopping-cart.component";

const routes: Routes = [
	{
		path: "",
		canActivateChild: [AuthGuard],
		children: [
			{
				path: "dashboard",
				component: DashboardComponent,
				children: [
					{ path: "profile", component: ProfileComponent},
					{ path: "search", component: SearchComponent},
					{ path: "shopping-cart", component: ShoppingCartComponent},
					{ path: "schedule", component: ScheduleComponent},
					{ path: "", redirectTo: "/student/dashboard/search", pathMatch: "full" },
					{ path: "**", component: PageNotFoundComponent },
				],
			},
			{ path: "", redirectTo: "/student/dashboard/search", pathMatch: "full" },
			{ path: "**", component: PageNotFoundComponent },
		],
	},
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule],
})
export class StudentRoutingModule {
}
