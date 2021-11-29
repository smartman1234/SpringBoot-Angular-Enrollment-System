import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Page } from "../../../../core/models/page.model";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { PageEvent } from "@angular/material/paginator";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Sort, SortDirection } from "@angular/material/sort";
import { AdminCourse } from "../state/admin-course.model";
import { Observable } from "rxjs";
import { AdminCourseQuery } from "../state/admin-course.query";
import { AdminCourseService } from "../state/admin-course.service";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";
import { filter, takeUntil } from "rxjs/operators";
import { AdminSubjectStore } from "../../admin-subject/state/admin-subject.store";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-course-list",
	templateUrl: "./admin-course-list.component.html",
	styleUrls: ["./admin-course-list.component.scss"],
})
export class AdminCourseListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminCourseService: AdminCourseService,
		private adminCourseQuery: AdminCourseQuery,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
		private adminSubjectStore: AdminSubjectStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Course";
	subtitle: string = "Course List";
	subjects$!: Observable<AdminSubject[]>;
	coursePage$!: Observable<Page<AdminCourse>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "courseCode", "courseName", "courseUnit", "courseDescription",
		"subjectId", "edit", "delete"];

	subjectForm = this.formBuilder.group({
		subject: ["", { validators: [Validators.required] }],
	});

	get subject() {
		return this.subjectForm.get("subject") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminCourseService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.coursePage$ = this.adminCourseQuery.adminCoursePage$;
		this.subjects$ = this.adminSubjectQuery.adminSubjects$;

		this.adminSubjectService.getAll().subscribe();
		combineQueries([
			this.adminSubjectQuery.selectAll().pipe(filter(subjects => subjects.length > 0)),
			this.adminSubjectQuery.selectActive(),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([subjects, activeSubject]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeSubject) {
				this.subject.setValue(activeSubject);
			} else {
				this.subject.setValue(subjects[0]);
				this.getCoursePage();
			}
		});
	}

	getCoursePage(pageable?: Pageable) {
		if (this.subject.value) {
			this.adminSubjectStore.setActive(this.subject.value.id);
			this.adminCourseService.getPage(this.subject.value.subjectAcronym, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getCoursePage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getCoursePage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createCourse() {
		this.adminCourseService.createCourse();
	}

	editCourse(course: AdminCourse) {
		this.adminCourseService.editCourse(course);
	}

	deleteCourse(course: AdminCourse) {
		this.adminCourseService.deleteCourse(course);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asCourse(value: any): AdminCourse {
		return value as AdminCourse;
	}

	trackCourse: TrackByFunction<AdminCourse> = (index: number, course: AdminCourse): string => {
		return course.id;
	};
}
