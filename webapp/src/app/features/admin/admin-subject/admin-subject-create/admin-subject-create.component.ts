import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { Observable } from "rxjs";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";

@Component({
	selector: "app-admin-subject-create",
	templateUrl: "./admin-subject-create.component.html",
	styleUrls: ["./admin-subject-create.component.scss"],
})
export class AdminSubjectCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminSubjectCreateComponent>,
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

	create() {
		this.dialogRef.close({
			departmentId: this.departmentId.value,
			subjectName: this.subjectName.value,
			subjectAcronym: this.subjectAcronym.value,
		});
	}

	getDepartments() {
		this.adminDepartmentService.getAll();
	}

	subjectForm = this.formBuilder.group({
		departmentId: ["", { validators: [Validators.required] }],
		subjectName: ["", { validators: [Validators.required, Validators.maxLength(100)] }],
		subjectAcronym: ["", { validators: [Validators.required, Validators.maxLength(3)] }],
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
