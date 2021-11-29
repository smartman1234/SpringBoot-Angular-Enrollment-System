import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { Observable } from "rxjs";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { AdminInstructor } from "../state/admin-instructor.model";

@Component({
	selector: "app-admin-instructor-edit",
	templateUrl: "./admin-instructor-edit.component.html",
	styleUrls: ["./admin-instructor-edit.component.scss"],
})
export class AdminInstructorEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminInstructorEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { instructor: AdminInstructor },
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
			id: this.data.instructor.id,
			departmentId: this.departmentId.value,
		});
	}

	getDepartments() {
		this.adminDepartmentService.getAll();
	}

	instructorForm = this.formBuilder.group({
		departmentId: [this.data.instructor.departmentId, { validators: [Validators.required] }],
	});

	get departmentId() {
		return this.instructorForm.get("departmentId") as FormControl;
	}

}
