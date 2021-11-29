import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminCourse } from "../state/admin-course.model";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { Observable } from "rxjs";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";

@Component({
	selector: "app-course-detail",
	templateUrl: "./admin-course-edit.component.html",
	styleUrls: ["./admin-course-edit.component.scss"],
})
export class AdminCourseEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminCourseEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { course: AdminCourse },
		private formBuilder: FormBuilder,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
	) {
	}

	subjects$!: Observable<AdminSubject[]>;

	ngOnInit(): void {
		this.subjects$ = this.adminSubjectQuery.adminSubjects$;
		this.getSubjects();
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.course.id,
			subjectId: this.subjectId.value,
			courseCode: this.courseCode.value,
			courseName: this.courseName.value,
			courseDescription: this.courseDescription.value,
			courseUnit: this.courseUnit.value,
		});
	}

	getSubjects() {
		this.adminSubjectService.getAll();
	}

	courseForm = this.formBuilder.group({
		subjectId: [this.data.course.subjectId, { validators: [Validators.required] }],
		courseCode: [this.data.course.courseCode, { validators: [Validators.required] }],
		courseName: [this.data.course.courseName, { validators: [Validators.required, Validators.maxLength(200)] }],
		courseDescription: [this.data.course.courseDescription, { validators: [Validators.required, Validators.maxLength(3000)] }],
		courseUnit: [this.data.course.courseUnit, { validators: [Validators.required, Validators.min(0)] }],
	});

	get courseCode() {
		return this.courseForm.get("courseCode") as FormControl;
	}

	get courseName() {
		return this.courseForm.get("courseName") as FormControl;
	}

	get courseDescription() {
		return this.courseForm.get("courseDescription") as FormControl;
	}

	get courseUnit() {
		return this.courseForm.get("courseUnit") as FormControl;
	}

	get subjectId() {
		return this.courseForm.get("subjectId") as FormControl;
	}

}
