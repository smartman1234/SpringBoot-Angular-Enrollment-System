import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "../../core/guards/auth.guard";
import { PageNotFoundComponent } from "../../core/components/page-not-found/page-not-found.component";
import { ProfileComponent } from "./profile/profile/profile.component";
import { SearchComponent } from "./search/search/search.component";
import { ShoppingCartComponent } from "./enrollment/shopping-cart/shopping-cart.component";
import { ScheduleComponent } from "./enrollment/schedule/schedule.component";
import { DashboardComponent } from "./dashboard/dashboard.component";

const routes: Routes = [
	{
		path: "",
		canActivateChild: [AuthGuard],
		children: [
			{
				path: "dashboard",
				component: DashboardComponent,
				children: [
					{ path: "profile", component: ProfileComponent },
					{ path: "search", component: SearchComponent },
					{ path: "shopping-cart", component: ShoppingCartComponent },
					{ path: "schedule", component: ScheduleComponent },
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
