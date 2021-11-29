import { Component, OnInit, TrackByFunction } from "@angular/core";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { Sort, SortDirection } from "@angular/material/sort";
import { PageEvent } from "@angular/material/paginator";
import { AdminCollege } from "../state/admin-college.model";
import { AdminCollegeService } from "../state/admin-college.service";
import { AdminCollegeQuery } from "../state/admin-college.query";
import { take } from "rxjs/operators";

@Component({
	selector: "app-admin-college-list",
	templateUrl: "./admin-college-list.component.html",
	styleUrls: ["./admin-college-list.component.scss"],
})
export class AdminCollegeListComponent implements OnInit {

	constructor(
		private adminCollegeService: AdminCollegeService,
		private adminCollegeQuery: AdminCollegeQuery,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
	}

	title: string = "College";
	subtitle: string = "College List";
	collegePage$!: Observable<Page<AdminCollege>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "collegeName", "edit", "delete"];

	ngOnInit(): void {
		const sort = this.adminCollegeService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.collegePage$ = this.adminCollegeQuery.adminCollegePage$;

		this.adminCollegeQuery.select(college => college.collegePage).pipe(
			take(1),
		).subscribe(collegePage => {
			if (collegePage.empty) {
				this.getCollegePage();
			}
		});
	}

	getCollegePage(pageable?: Pageable) {
		this.adminCollegeService.getPage(pageable);
	}

	onSortChange(sort: Sort) {
		this.getCollegePage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getCollegePage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createCollege() {
		this.adminCollegeService.createCollege();
	}

	editCollege(college: AdminCollege) {
		this.adminCollegeService.editCollege(college);
	}

	deleteCollege(college: AdminCollege) {
		this.adminCollegeService.deleteCollege(college);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asCollege(value: any): AdminCollege {
		return value as AdminCollege;
	}

	trackCollege: TrackByFunction<AdminCollege> = (index: number, college: AdminCollege): string => {
		return college.id;
	};

}
