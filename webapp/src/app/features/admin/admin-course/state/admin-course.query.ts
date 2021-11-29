import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminCourseState, AdminCourseStore } from "./admin-course.store";
import { Observable } from "rxjs";
import { AdminCourse } from "./admin-course.model";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "courseCode",
	sortByOrder: Order.ASC,
})
export class AdminCourseQuery extends QueryEntity<AdminCourseState> {

	adminCoursesBySubject(subjectIdToFilter: string): Observable<AdminCourse[]> {
		return this.selectAll({
			filterBy: ({ subjectId }) => subjectId === subjectIdToFilter,
		});
	}

	adminCoursePage$ = this.select(state => state.coursePage);

	constructor(
		protected store: AdminCourseStore,
	) {
		super(store);
	}
}
