import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminTermService } from "../../admin-term/state/admin-term.service";
import { AdminTermQuery } from "../../admin-term/state/admin-term.query";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";
import { AdminCourseService } from "../../admin-course/state/admin-course.service";
import { AdminCourseQuery } from "../../admin-course/state/admin-course.query";
import { Observable } from "rxjs";
import { AdminTerm } from "../../admin-term/state/admin-term.model";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { AdminCourse } from "../../admin-course/state/admin-course.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";
import { tap } from "rxjs/operators";
import { PageEvent } from "@angular/material/paginator";
import { AdminStudent } from "../../admin-student/state/admin-student.model";
import { AdminSection } from "../../admin-section/state/admin-section.model";
import { AdminSectionService } from "../../admin-section/state/admin-section.service";
import { AdminSectionQuery } from "../../admin-section/state/admin-section.query";
import { AdminStudentService } from "../../admin-student/state/admin-student.service";

@Component({
	selector: "app-admin-enrollment-create",
	templateUrl: "./admin-enrollment-create.component.html",
	styleUrls: ["./admin-enrollment-create.component.scss"],
})
export class AdminEnrollmentCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminEnrollmentCreateComponent>,
		private formBuilder: FormBuilder,
		private adminTermService: AdminTermService,
		private adminTermQuery: AdminTermQuery,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
		private adminCourseService: AdminCourseService,
		private adminCourseQuery: AdminCourseQuery,
		private adminSectionService: AdminSectionService,
		private adminSectionQuery: AdminSectionQuery,
		private adminStudentService: AdminStudentService,
	) {
	}

	terms$!: Observable<AdminTerm[]>;
	subjects$!: Observable<AdminSubject[]>;
	courses$!: Observable<AdminCourse[]>;
	sections$!: Observable<AdminSection[]>;
	studentPage: Page<AdminStudent> = emptyPage;

	ngOnInit(): void {
		this.terms$ = this.adminTermQuery.adminTerms$;
		this.adminTermService.getAll().subscribe();

		this.subjects$ = this.adminSubjectQuery.adminSubjects$;
		this.adminSubjectService.getAll().subscribe();

		this.getStudentPage();
	}

	getCourses() {
		if (this.subject.value) {
			this.adminCourseService.getAll(this.subject.value.subjectAcronym).subscribe();
			this.courses$ = this.adminCourseQuery.adminCoursesBySubject(this.subject.value.id)
				.pipe(tap(adminCourses => {
					if (adminCourses.length > 0) {
						this.section.disable();
						this.section.setValue("");
						this.course.enable();
						this.course.setValue("");
					}
				}));
		}
	}

	getSections() {
		if (this.term.value && this.course.value) {
			this.adminSectionService.getAll(this.term.value.id, this.course.value.id).subscribe();
			this.sections$ = this.adminSectionQuery.adminSectionsByCourseId(this.course.value.id)
				.pipe(tap(adminSections => {
					if (adminSections.length > 0) {
						this.section.setValue("");
						this.section.enable();
					}
				}));
		}
	}

	getStudentPage(page: number = 0) {
		const pageable = {
			page,
			size: 20,
			sort: ["email"],
		};
		this.adminStudentService
			.getPage2(pageable)
			.subscribe(studentPage => {
				this.student.enable();
				this.studentPage = studentPage;
			});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.student.setValue("");
		this.getStudentPage(pageEvent.pageIndex);
	}

	create() {
		this.dialogRef.close({
			studentId: this.student.value.id,
			sectionId: this.section.value.id,
		});
	}

	enrollmentForm = this.formBuilder.group({
		term: ["", { validators: [Validators.required] }],
		subject: ["", { validators: [Validators.required] }],
		course: [{ value: "", disabled: true }, { validators: [Validators.required] }],
		section: [{ value: "", disabled: true }, { validators: [Validators.required] }],
		student: ["", { validators: [Validators.required] }],
	});

	get term() {
		return this.enrollmentForm.get("term") as FormControl;
	}

	get subject() {
		return this.enrollmentForm.get("subject") as FormControl;
	}

	get course() {
		return this.enrollmentForm.get("course") as FormControl;
	}

	get section() {
		return this.enrollmentForm.get("section") as FormControl;
	}

	get student() {
		return this.enrollmentForm.get("student") as FormControl;
	}

}
