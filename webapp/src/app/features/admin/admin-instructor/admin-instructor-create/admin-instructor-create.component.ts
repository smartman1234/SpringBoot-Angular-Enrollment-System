import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { Observable, of } from "rxjs";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { Page } from "../../../../core/models/page.model";
import { AdminUser } from "../../admin-user/state/admin-user.model";
import { PageEvent } from "@angular/material/paginator";
import { AdminUserService } from "../../admin-user/state/admin-user.service";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

@Component({
	selector: "app-admin-instructor-create",
	templateUrl: "./admin-instructor-create.component.html",
	styleUrls: ["./admin-instructor-create.component.scss"],
})
export class AdminInstructorCreateComponent implements OnInit {

	constructor(
		public dialogRef: MatDialogRef<AdminInstructorCreateComponent>,
		private formBuilder: FormBuilder,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminUserService: AdminUserService,
	) {
	}

	departments$!: Observable<AdminDepartment[]>;
	userPage: Page<AdminUser> = emptyPage;

	ngOnInit(): void {
		this.departments$ = this.adminDepartmentQuery.adminDepartments$;
		this.getDepartments();
		this.getUserPage();
	}

	create() {
		this.dialogRef.close({
			departmentId: this.departmentId.value,
			userId: this.userId.value,
		});
	}

	getUserPage(page: number = 0) {
		const pageable = {
			page,
			size: 20,
			sort: ["username"],
		};
		this.adminUserService.getPage2(pageable, ["ROLE_INSTRUCTOR"]).subscribe(userPage => {
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

	instructorForm = this.formBuilder.group({
		departmentId: ["", { validators: [Validators.required] }],
		userId: ["", { validators: [Validators.required] }],
	});

	get userId() {
		return this.instructorForm.get("userId") as FormControl;
	}

	get departmentId() {
		return this.instructorForm.get("departmentId") as FormControl;
	}

}
