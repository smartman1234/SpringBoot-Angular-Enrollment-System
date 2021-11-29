import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { CourseState, CourseStore } from "./course.store";

@Injectable({ providedIn: "root" })
export class CourseQuery extends QueryEntity<CourseState> {

	courses$ = this.selectAll();
	ids$ = this.select(state => state.ids);

	course(courseId: string) {
		return this.selectEntity(courseId);
	}

	constructor(protected store: CourseStore) {
		super(store);
	}

}
