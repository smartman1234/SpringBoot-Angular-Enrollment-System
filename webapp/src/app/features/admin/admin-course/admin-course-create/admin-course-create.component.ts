import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminSubject } from "../../admin-subject/state/admin-subject.model";
import { AdminSubjectService } from "../../admin-subject/state/admin-subject.service";
import { Observable } from "rxjs";
import { AdminSubjectQuery } from "../../admin-subject/state/admin-subject.query";

@Component({
	selector: "app-course-create",
	templateUrl: "./admin-course-create.component.html",
	styleUrls: ["./admin-course-create.component.scss"],
})
export class AdminCourseCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminCourseCreateComponent>,
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

	create() {
		this.dialogRef.close({
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
		subjectId: ["", { validators: [Validators.required] }],
		courseCode: ["", { validators: [Validators.required] }],
		courseName: ["", { validators: [Validators.required, Validators.maxLength(200)] }],
		courseDescription: ["", { validators: [Validators.required, Validators.maxLength(3000)] }],
		courseUnit: ["", { validators: [Validators.required, Validators.min(0)] }],
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
