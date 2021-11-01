import { Component, ContentChild, ElementRef, Input, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { MatSidenav } from "@angular/material/sidenav";

@Component({
	selector: "app-navigation-bar",
	templateUrl: "./navigation-bar.component.html",
	styleUrls: ["./navigation-bar.component.scss"],
})
export class NavigationBarComponent implements OnInit {

	@ViewChild("sidenav") sidenav!: MatSidenav;
	@ViewChild("content") content!: ElementRef;
	@Input() title: string = "";

	@ContentChild("toolbarList") toolbarListRef!: TemplateRef<any>;
	@ContentChild("sidenavList") sidenavListRef!: TemplateRef<any>;
	@ContentChild("sidenavContent") sidenavContentRef!: TemplateRef<any>;

	breakPoint: number = 700;
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
		this.content.nativeElement.scroll({
			top: 0,
			left: 0,
			behavior: 'smooth'
		});
	}

	constructor() {
	}

	ngOnInit(): void {
	}

}
