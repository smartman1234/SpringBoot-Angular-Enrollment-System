import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminCollegeService } from "../../admin-college/state/admin-college.service";
import { AdminCollegeQuery } from "../../admin-college/state/admin-college.query";
import { AdminCollegeStore } from "../../admin-college/state/admin-college.store";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { AdminCollege } from "../../admin-college/state/admin-college.model";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminDepartment } from "../state/admin-department.model";
import { AdminDepartmentService } from "../state/admin-department.service";
import { AdminDepartmentQuery } from "../state/admin-department.query";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-department-list",
	templateUrl: "./admin-department-list.component.html",
	styleUrls: ["./admin-department-list.component.scss"],
})
export class AdminDepartmentListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminCollegeService: AdminCollegeService,
		private adminCollegeQuery: AdminCollegeQuery,
		private adminCollegeStore: AdminCollegeStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Department";
	subtitle: string = "Department List";
	colleges$!: Observable<AdminCollege[]>;
	departmentPage$!: Observable<Page<AdminDepartment>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "departmentName", "collegeId", "edit", "delete"];

	collegeForm = this.formBuilder.group({
		college: ["", { validators: [Validators.required] }],
	});

	get college() {
		return this.collegeForm.get("college") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminDepartmentService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.departmentPage$ = this.adminDepartmentQuery.adminDepartmentPage$;
		this.colleges$ = this.adminCollegeQuery.adminColleges$;

		this.adminCollegeService.getAll().subscribe();
		combineQueries([
			this.adminCollegeQuery.selectAll().pipe(filter(colleges => colleges.length > 0)),
			this.adminCollegeQuery.selectActive(),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([colleges, activeCollege]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeCollege) {
				this.college.setValue(activeCollege);
			} else {
				this.college.setValue(colleges[0]);
				this.getDepartmentPage();
			}
		});
	}

	getDepartmentPage(pageable?: Pageable) {
		if (this.college.value) {
			this.adminCollegeStore.setActive(this.college.value.id);
			this.adminDepartmentService.getPage(this.college.value.collegeName, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getDepartmentPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getDepartmentPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createDepartment() {
		this.adminDepartmentService.createDepartment();
	}

	editDepartment(department: AdminDepartment) {
		this.adminDepartmentService.editDepartment(department);
	}

	deleteDepartment(department: AdminDepartment) {
		this.adminDepartmentService.deleteDepartment(department);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asDepartment(value: any): AdminDepartment {
		return value as AdminDepartment;
	}

	trackDepartment: TrackByFunction<AdminDepartment> = (index: number, department: AdminDepartment): string => {
		return department.id;
	};

}
