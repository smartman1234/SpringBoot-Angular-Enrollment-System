import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminStudentService } from "../state/admin-student.service";
import { AdminStudentQuery } from "../state/admin-student.query";
import { AdminStudent } from "../state/admin-student.model";

@Component({
	selector: "app-admin-student-list",
	templateUrl: "./admin-student-list.component.html",
	styleUrls: ["./admin-student-list.component.scss"],
})
export class AdminStudentListComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminStudentService: AdminStudentService,
		private adminStudentQuery: AdminStudentQuery,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
	}

	title: string = "Student";
	subtitle: string = "Student List";
	studentPage$!: Observable<Page<AdminStudent>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "email", "firstName", "lastName", "maxUnit",
		"userId", "edit", "delete"];

	ngOnInit(): void {
		const sort = this.adminStudentService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.studentPage$ = this.adminStudentQuery.adminStudentPage$;

		this.getStudentPage();
	}

	getStudentPage(pageable?: Pageable) {
		this.adminStudentService.getPage(pageable);
	}

	onSortChange(sort: Sort) {
		this.getStudentPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getStudentPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createStudent() {
		this.adminStudentService.createStudent();
	}

	editStudent(student: AdminStudent) {
		this.adminStudentService.editStudent(student);
	}

	deleteStudent(student: AdminStudent) {
		this.adminStudentService.deleteStudent(student);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asStudent(value: any): AdminStudent {
		return value as AdminStudent;
	}

	trackStudent: TrackByFunction<AdminStudent> = (index: number, student: AdminStudent): string => {
		return student.id;
	};

}
