import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CourseSection } from "../state/section/course-section.model";
import { Section } from "../state/section/section.model";

@Component({
	selector: "app-search-result",
	templateUrl: "./search-result.component.html",
	styleUrls: ["./search-result.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SearchResultComponent implements OnInit {

	@Input() accordionOpened: boolean = false;
	@Input() courses!: Array<CourseSection>;
	@Input() registeredSectionIds!: Array<string>;
	@Output() courseInfoEvent = new EventEmitter<string>();
	@Output() addToCartEvent = new EventEmitter<string>();

	displayedColumns: string[] = ["section", "schedule", "room", "instructor", "dates", "waitList", "status", "action"];

	openCourseInfo(courseId: string) {
		this.courseInfoEvent.emit(courseId);
	}

	addToCart(sectionId: string) {
		this.addToCartEvent.emit(sectionId);
	}

	trackSection(index: number, section: Section): string {
		return section.id;
	}

	constructor() {
	}

	ngOnInit(): void {
	}

	asSection(value: any): Section {
		return value as Section;
	}

}
