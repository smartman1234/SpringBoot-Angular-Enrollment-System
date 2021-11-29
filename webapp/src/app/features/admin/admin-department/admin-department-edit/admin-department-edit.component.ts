import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminCollegeService } from "../../admin-college/state/admin-college.service";
import { AdminCollegeQuery } from "../../admin-college/state/admin-college.query";
import { Observable } from "rxjs";
import { AdminCollege } from "../../admin-college/state/admin-college.model";
import { AdminDepartment } from "../state/admin-department.model";

@Component({
  selector: 'app-admin-department-edit',
  templateUrl: './admin-department-edit.component.html',
  styleUrls: ['./admin-department-edit.component.scss']
})
export class AdminDepartmentEditComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminDepartmentEditComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { department: AdminDepartment },
		private formBuilder: FormBuilder,
		private adminCollegeService: AdminCollegeService,
		private adminCollegeQuery: AdminCollegeQuery,
	) {
	}

	colleges$!: Observable<AdminCollege[]>;

	ngOnInit(): void {
		this.colleges$ = this.adminCollegeQuery.adminColleges$;
		this.getColleges();
	}

	saveEdit() {
		this.dialogRef.close({
			id: this.data.department.id,
			collegeId: this.collegeId.value,
			departmentName: this.departmentName.value,
		});
	}

	getColleges() {
		this.adminCollegeService.getAll();
	}

	departmentForm = this.formBuilder.group({
		collegeId: [this.data.department.collegeId, { validators: [Validators.required] }],
		departmentName: [this.data.department.departmentName, { validators: [Validators.required, Validators.maxLength(100)] }],
	});

	get departmentName() {
		return this.departmentForm.get("departmentName") as FormControl;
	}

	get collegeId() {
		return this.departmentForm.get("collegeId") as FormControl;
	}

}
