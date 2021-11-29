import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminTermService } from "../../admin-term/state/admin-term.service";
import { AdminTermQuery } from "../../admin-term/state/admin-term.query";
import { AdminTermStore } from "../../admin-term/state/admin-term.store";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { AdminTerm } from "../../admin-term/state/admin-term.model";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil, tap } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminEnrollmentService } from "../state/admin-enrollment.service";
import { AdminEnrollmentQuery } from "../state/admin-enrollment.query";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { AdminEnrollment } from "../state/admin-enrollment.model";
import { AdminCourseService } from "../../admin-course/state/admin-course.service";
import { AdminCourseQuery } from "../../admin-course/state/admin-course.query";
import { AdminCourse } from "../../admin-course/state/admin-course.model";
import { AdminSectionService } from "../../admin-section/state/admin-section.service";
import { AdminSectionQuery } from "../../admin-section/state/admin-section.query";
import { AdminSection } from "../../admin-section/state/admin-section.model";
import { AdminEnrollmentStore } from "../state/admin-enrollment.store";
import { emptyPage } from "../../../../core/constants/empty-page-slice";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-enrollment-list",
	templateUrl: "./admin-enrollment-list.component.html",
	styleUrls: ["./admin-enrollment-list.component.scss"],
})
export class AdminEnrollmentListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminEnrollmentService: AdminEnrollmentService,
		private adminEnrollmentQuery: AdminEnrollmentQuery,
		private adminTermService: AdminTermService,
		private adminTermQuery: AdminTermQuery,
		private adminTermStore: AdminTermStore,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
		private adminCourseService: AdminCourseService,
		private adminCourseQuery: AdminCourseQuery,
		private adminSectionService: AdminSectionService,
		private adminSectionQuery: AdminSectionQuery,
		private adminEnrollmentStore: AdminEnrollmentStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Enrollment";
	subtitle: string = "Enrollment List";
	terms$!: Observable<AdminTerm[]>;
	subjects$!: Observable<AdminSubject[]>;
	courses$!: Observable<AdminCourse[]>;
	sections$!: Observable<AdminSection[]>;
	enrollmentPage$!: Observable<Page<AdminEnrollment>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";
	breakPoint: number = 1000;
	showScrollToTop: boolean = false;

	displayedColumns: string[] = ["student", "course", "enrollmentStatus", "accessCode", "meetingDays",
		"classCapacity", "waitlist", "date", "room", "instructor", "termName",
		"studentId", "sectionId", "edit", "delete"];

	filterForm = this.formBuilder.group({
		term: ["", { validators: [Validators.required] }],
		subject: ["", { validators: [Validators.required] }],
		course: [{ value: "", disabled: true }, { validators: [Validators.required] }],
		section: [{ value: "", disabled: true }, { validators: [Validators.required] }],
	});

	get term() {
		return this.filterForm.get("term") as FormControl;
	}

	get subject() {
		return this.filterForm.get("subject") as FormControl;
	}

	get course() {
		return this.filterForm.get("course") as FormControl;
	}

	get section() {
		return this.filterForm.get("section") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminEnrollmentService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.enrollmentPage$ = this.adminEnrollmentQuery.adminEnrollmentPage$;
		this.terms$ = this.adminTermQuery.adminTerms$;
		this.subjects$ = this.adminSubjectQuery.adminSubjects$;

		this.adminTermService.getAll().subscribe();
		this.adminSubjectService.getAll().subscribe();
		combineQueries([
			this.adminTermQuery.selectAll().pipe(filter(terms => terms.length > 0)),
			this.adminTermQuery.selectActive(),
			this.adminSubjectQuery.selectAll().pipe(filter(subjects => subjects.length > 0)),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([terms, activeTerm, subjects]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeTerm) {
				this.term.setValue(activeTerm);
			} else {
				this.term.setValue(terms[0]);
			}

			this.subject.setValue(subjects[0]);
			this.getCourses();
		});
	}

	onScroll(event: any) {
		const scrollValue = event.target.offsetHeight + event.target.scrollTop;
		if (!this.showScrollToTop && scrollValue >= this.breakPoint) {
			this.showScrollToTop = true;
		}
		if (this.showScrollToTop && scrollValue < this.breakPoint) {
			this.showScrollToTop = false;
		}
	}

	scrollToTop() {
		this.scrollToTopService.scrollToTop("admin-table-container");
	}

	getCourses() {
		if (this.subject.value) {
			this.adminCourseService.getAll(this.subject.value.subjectAcronym).subscribe();
			this.courses$ = this.adminCourseQuery.adminCoursesBySubject(this.subject.value.id)
				.pipe(tap(adminCourses => {
					if (adminCourses.length > 0) {
						this.course.enable();
						this.course.setValue("");
						this.section.disable();
						this.section.setValue("");
						this.adminEnrollmentStore.update({ enrollmentPage: emptyPage });
					}
				}));
		}
	}

	getSections() {
		if (this.term.value && this.course.value) {
			this.adminTermStore.setActive(this.term.value.id);
			this.adminSectionService.getAll(this.term.value.id, this.course.value.id).subscribe();
			this.sections$ = this.adminSectionQuery.adminSectionsByCourseId(this.course.value.id)
				.pipe(tap(adminSections => {
					if (adminSections.length > 0) {
						this.adminEnrollmentStore.update({ enrollmentPage: emptyPage });
						this.section.setValue("");
						this.section.enable();
					}
				}));
		}
	}

	getEnrollmentPage(pageable?: Pageable) {
		if (this.section.value) {
			this.adminEnrollmentService.getPage(this.section.value.id, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getEnrollmentPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getEnrollmentPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
	}

	createEnrollment() {
		this.adminEnrollmentService.createEnrollment();
	}

	editEnrollment(enrollment: AdminEnrollment) {
		this.adminEnrollmentService.editEnrollment(enrollment);
	}

	deleteEnrollment(enrollment: AdminEnrollment) {
		this.adminEnrollmentService.deleteEnrollment(enrollment);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asEnrollment(value: any): AdminEnrollment {
		return value as AdminEnrollment;
	}

	trackEnrollment: TrackByFunction<AdminEnrollment> = (index: number, enrollment: AdminEnrollment): string => {
		return enrollment.studentId + enrollment.sectionId;
	};

}
