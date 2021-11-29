import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminCollegeService } from "../../admin-college/state/admin-college.service";
import { AdminCollegeQuery } from "../../admin-college/state/admin-college.query";
import { Observable } from "rxjs";
import { AdminCollege } from "../../admin-college/state/admin-college.model";

@Component({
	selector: "app-admin-department-create",
	templateUrl: "./admin-department-create.component.html",
	styleUrls: ["./admin-department-create.component.scss"],
})
export class AdminDepartmentCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminDepartmentCreateComponent>,
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

	create() {
		this.dialogRef.close({
			collegeId: this.collegeId.value,
			departmentName: this.departmentName.value,
		});
	}

	getColleges() {
		this.adminCollegeService.getAll();
	}

	departmentForm = this.formBuilder.group({
		collegeId: ["", { validators: [Validators.required] }],
		departmentName: ["", { validators: [Validators.required, Validators.maxLength(100)] }],
	});

	get departmentName() {
		return this.departmentForm.get("departmentName") as FormControl;
	}

	get collegeId() {
		return this.departmentForm.get("collegeId") as FormControl;
	}

}
