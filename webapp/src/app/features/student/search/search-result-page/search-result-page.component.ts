import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { PageEvent } from "@angular/material/paginator";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { CourseSection } from "../state/section/course-section.model";

@Component({
	selector: "app-search-result-page",
	templateUrl: "./search-result-page.component.html",
	styleUrls: ["./search-result-page.component.scss"],
})
export class SearchResultPageComponent implements OnInit {

	pageEvent!: PageEvent;
	pageSizeOptions: number[] = [5, 10, 20, 25, 50, 100];

	@Input() pageSize: number = 20;
	@Input() pageSection$!: Observable<Page<CourseSection>>;
	@Input() registeredSectionIds$!: Observable<Array<string>>;
	@Output() addToCartEvent = new EventEmitter<string>();
	@Output() courseInfoEvent = new EventEmitter<string>();
	@Output() pageChangeEvent = new EventEmitter<PageEvent>();

	constructor() {
	}

	openCourseInfo(courseId: string) {
		this.courseInfoEvent.emit(courseId);
	}

	addToCart(sectionId: string) {
		this.addToCartEvent.emit(sectionId);
	}

	onPageEvent(pageEvent: PageEvent) {
		this.pageEvent = pageEvent;
		this.pageChangeEvent.emit(pageEvent);
	}

	ngOnInit(): void {
	}

}
