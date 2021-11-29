import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Course } from "./course.model";

export interface CourseState extends EntityState<Course> {}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "course" })
export class CourseStore extends EntityStore<CourseState> {

	constructor() {
		super();
	}

}
