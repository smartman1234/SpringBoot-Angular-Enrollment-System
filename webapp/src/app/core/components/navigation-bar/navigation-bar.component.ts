import { Component, ContentChild, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";
import { ScrollToTopService } from "../../services/scroll-to-top.service";

@Component({
	selector: "app-navigation-bar",
	templateUrl: "./navigation-bar.component.html",
	styleUrls: ["./navigation-bar.component.scss"],
})
export class NavigationBarComponent implements OnInit {

	@ViewChild("sidenav") sidenav!: MatSidenav;
	@Input() title: string = "";

	@ContentChild("toolbarList") toolbarListRef!: TemplateRef<any>;
	@ContentChild("sidenavList") sidenavListRef!: TemplateRef<any>;
	@ContentChild("sidenavContent") sidenavContentRef!: TemplateRef<any>;

	breakPoint: number = 1000;
	showScrollToTop: boolean = false;

	onScroll(event: any) {
		const scrollValue = event.target.offsetHeight + event.target.scrollTop;
		if (!this.showScrollToTop && scrollValue >= this.breakPoint) {
			this.showScrollToTop = true;
		}
		if (this.showScrollToTop && scrollValue < this.breakPoint) {
			this.showScrollToTop = false;
		}
	}

	scrollToTop() {
		this.scrollToTopService.scrollToTop("content");
	}

	constructor(
		private scrollToTopService: ScrollToTopService,
	) {
	}

	ngOnInit(): void {
	}

}
