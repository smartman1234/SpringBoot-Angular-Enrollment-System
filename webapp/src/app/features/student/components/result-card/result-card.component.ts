import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { CourseSection } from "../../models/course.sections.model";
import { Section } from "../../models/section.model";

@Component({
	selector: "app-result-card",
	templateUrl: "./result-card.component.html",
	styleUrls: ["./result-card.component.scss"],
	changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ResultCardComponent implements OnInit {

	@Input() courses!: Array<CourseSection>;
	@Input() registeredSectionIds!: Array<string>;
	@Output() courseInfoEvent = new EventEmitter<string>();
	@Output() addToCartEvent = new EventEmitter<string>();

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

}
