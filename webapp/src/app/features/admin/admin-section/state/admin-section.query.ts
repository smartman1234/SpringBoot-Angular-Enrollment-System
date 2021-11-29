import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity, SortBy } from "@datorama/akita";
import { AdminSectionState, AdminSectionStore } from "./admin-section.store";
import { AdminSection } from "./admin-section.model";
import { Observable } from "rxjs";

const sortBy: SortBy<AdminSection, AdminSectionState> = (a, b, state) => {
	if (a.courseCode === b.courseCode) {
		return a.sectionNumber - b.sectionNumber;
	}
	return a.courseCode > b.courseCode ? 1 : -1;
};

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: sortBy,
	sortByOrder: Order.ASC,
})
export class AdminSectionQuery extends QueryEntity<AdminSectionState> {

	adminSectionsByCourseId(courseIdToFilter: string): Observable<AdminSection[]> {
		return this.selectAll({
			filterBy: ({ courseId }) => courseId === courseIdToFilter,
		});
	}

	adminSectionPage$ = this.select(state => state.sectionPage);

	constructor(protected store: AdminSectionStore) {
		super(store);
	}

}
