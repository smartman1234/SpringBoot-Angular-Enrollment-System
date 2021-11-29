import { Component, OnInit, ViewChild } from "@angular/core";
import { NavigationBarComponent } from "../../../core/components/navigation-bar/navigation-bar.component";
import { ScrollToTopService } from "../../../core/services/scroll-to-top.service";

@Component({
	selector: "app-admin-dashboard",
	templateUrl: "./admin-dashboard.component.html",
	styleUrls: ["./admin-dashboard.component.scss"],
})
export class AdminDashboardComponent implements OnInit {

	@ViewChild(NavigationBarComponent) navBar!: NavigationBarComponent;
	title = "Admin Dashboard";

	constructor(
		private scrollToTopService: ScrollToTopService,
	) {
	}

	ngOnInit(): void {
	}

	onActivate() {
		if (this.navBar != null) {
			this.scrollToTopService.toTop("content");
		}
	}

}
