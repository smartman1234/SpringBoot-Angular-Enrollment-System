import { Inject, Injectable } from "@angular/core";
import { DOCUMENT } from "@angular/common";

@Injectable({
	providedIn: "root",
})
export class ScrollToTopService {

	constructor(
		@Inject(DOCUMENT) private document: Document,
	) {
	}

	content: HTMLElement | null = this.document.getElementById("content");

	toTop(elementId: string, distance: number = 0) {
		const content: HTMLElement | null = this.document.getElementById(elementId);
		if (content) {
			content.scrollTop = distance;
		}
	}

	scrollToTop(elementId: string) {
		const content: HTMLElement | null = this.document.getElementById(elementId);
		if (content) {
			content.scroll({
				top: 0,
				left: 0,
				behavior: "smooth",
			});
		}
	}
}
