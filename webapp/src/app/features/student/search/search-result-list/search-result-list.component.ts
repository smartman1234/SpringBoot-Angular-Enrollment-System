import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { CourseSection } from "../state/section/course-section.model";
import { Section } from "../state/section/section.model";

@Component({
	selector: "app-search-result-list",
	templateUrl: "./search-result-list.component.html",
	styleUrls: ["./search-result-list.component.scss"],
})
export class SearchResultListComponent implements OnInit {

	@Input() pageSection$!: Observable<Page<CourseSection>>;
	@Input() registeredSectionIds$!: Observable<Array<string>>;
	@Output() addToCartEvent = new EventEmitter<string>();
	@Output() courseInfoEvent = new EventEmitter<string>();

	displayedColumns: string[] = ["section", "schedule", "room", "instructor", "dates", "waitList", "status", "action"];

	constructor() {
	}

	openCourseInfo(courseId: string) {
		this.courseInfoEvent.emit(courseId);
	}

	addToCart(sectionId: string) {
		this.addToCartEvent.emit(sectionId);
	}

	ngOnInit(): void {
	}

	asSection(value: any): Section {
		return value as Section;
	}

}
