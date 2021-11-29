import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { AdminSubject } from "../state/admin-subject.model";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";

@Component({
	selector: "app-admin-subject-edit",
	templateUrl: "./admin-subject-edit.component.html",
	styleUrls: ["./admin-subject-edit.component.scss"],
})
export class AdminSubjectEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminSubjectEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { subject: AdminSubject },
		private formBuilder: FormBuilder,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
	) {
	}

	departments$!: Observable<AdminDepartment[]>;

	ngOnInit(): void {
		this.departments$ = this.adminDepartmentQuery.adminDepartments$;
		this.getDepartments();
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.subject.id,
			departmentId: this.departmentId.value,
			subjectName: this.subjectName.value,
			subjectAcronym: this.subjectAcronym.value,
		});
	}

	getDepartments() {
		this.adminDepartmentService.getAll();
	}

	subjectForm = this.formBuilder.group({
		departmentId: [this.data.subject.departmentId, { validators: [Validators.required] }],
		subjectName: [this.data.subject.subjectName, { validators: [Validators.required, Validators.maxLength(100)] }],
		subjectAcronym: [this.data.subject.subjectAcronym, { validators: [Validators.required, Validators.maxLength(3)] }],
	});

	get subjectName() {
		return this.subjectForm.get("subjectName") as FormControl;
	}

	get subjectAcronym() {
		return this.subjectForm.get("subjectAcronym") as FormControl;
	}

	get departmentId() {
		return this.subjectForm.get("departmentId") as FormControl;
	}

}
