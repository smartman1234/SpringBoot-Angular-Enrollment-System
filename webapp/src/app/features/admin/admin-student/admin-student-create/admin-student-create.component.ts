import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminUserService } from "../../admin-user/state/admin-user.service";
import { Observable } from "rxjs";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { Page } from "../../../../core/models/page.model";
import { AdminUser } from "../../admin-user/state/admin-user.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";
import { PageEvent } from "@angular/material/paginator";

@Component({
  selector: 'app-admin-student-create',
  templateUrl: './admin-student-create.component.html',
  styleUrls: ['./admin-student-create.component.scss']
})
export class AdminStudentCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminStudentCreateComponent>,
		private formBuilder: FormBuilder,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminUserService: AdminUserService,
	) {
	}

	userPage: Page<AdminUser> = emptyPage;

	ngOnInit(): void {
		this.getUserPage();
	}

	create() {
		this.dialogRef.close({
			maxUnit: this.maxUnit.value,
			userId: this.userId.value,
		});
	}

	getUserPage(page: number = 0) {
		const pageable = {
			page,
			size: 20,
			sort: ["username"],
		};
		this.adminUserService.getPage2(pageable, ["ROLE_STUDENT"]).subscribe(userPage => {
			this.userPage = userPage;
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.userId.setValue("");
		this.getUserPage(pageEvent.pageIndex);
	}

	getDepartments() {
		this.adminDepartmentService.getAll();
	}

	studentForm = this.formBuilder.group({
		userId: ["", { validators: [Validators.required] }],
		maxUnit: ["", { validators: [Validators.required, Validators.max(20)] }],
	});

	get userId() {
		return this.studentForm.get("userId") as FormControl;
	}

	get maxUnit() {
		return this.studentForm.get("maxUnit") as FormControl;
	}

}
