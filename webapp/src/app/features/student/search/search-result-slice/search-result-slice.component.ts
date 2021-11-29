import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { CourseSection } from "../state/section/course-section.model";

@Component({
  selector: 'app-search-result-slice',
  templateUrl: './search-result-slice.component.html',
  styleUrls: ['./search-result-slice.component.scss']
})
export class SearchResultSliceComponent implements OnInit {

	infiniteScrollContainer: string = ".content";
	@Input() pageSection$!: Observable<Page<CourseSection>>;
	@Input() registeredSectionIds$!: Observable<Array<string>>;
	@Output() addToCartEvent = new EventEmitter<string>();
	@Output() courseInfoEvent = new EventEmitter<string>();
	@Output() scrollEvent = new EventEmitter<number>();

	openCourseInfo(courseId: string) {
		this.courseInfoEvent.emit(courseId);
	}

	addToCart(sectionId: string) {
		this.addToCartEvent.emit(sectionId);
	}

	onScroll(index: number, last: boolean) {
		if (!last) {
			this.scrollEvent.emit(index + 1);
		}
	}

	constructor() {
	}

	ngOnInit(): void {

	}

}
