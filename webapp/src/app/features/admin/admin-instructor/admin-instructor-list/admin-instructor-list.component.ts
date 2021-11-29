import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminDepartmentStore } from "../../admin-department/state/admin-department.store";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { AdminInstructorService } from "../state/admin-instructor.service";
import { AdminInstructorQuery } from "../state/admin-instructor.query";
import { AdminInstructor } from "../state/admin-instructor.model";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-instructor-list",
	templateUrl: "./admin-instructor-list.component.html",
	styleUrls: ["./admin-instructor-list.component.scss"],
})
export class AdminInstructorListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminInstructorService: AdminInstructorService,
		private adminInstructorQuery: AdminInstructorQuery,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminDepartmentStore: AdminDepartmentStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Instructor";
	subtitle: string = "Instructor List";
	departments$!: Observable<AdminDepartment[]>;
	instructorPage$!: Observable<Page<AdminInstructor>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "email", "firstName", "lastName", "userId",
		"departmentId", "edit", "delete"];

	departmentForm = this.formBuilder.group({
		department: ["", { validators: [Validators.required] }],
	});

	get department() {
		return this.departmentForm.get("department") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminInstructorService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.instructorPage$ = this.adminInstructorQuery.adminInstructorPage$;
		this.departments$ = this.adminDepartmentQuery.adminDepartments$;

		this.adminDepartmentService.getAll().subscribe();
		combineQueries([
			this.adminDepartmentQuery.selectAll().pipe(filter(departments => departments.length > 0)),
			this.adminDepartmentQuery.selectActive(),
		]).pipe(
			takeUntil(this.unsubscribe$),
		).subscribe(([departments, activeDepartment]) => {
			this.unsubscribe$.next();
			this.unsubscribe$.complete();
			if (activeDepartment) {
				this.department.setValue(activeDepartment);
			} else {
				this.department.setValue(departments[0]);
			}
			this.getInstructorPage();
		});
	}

	getInstructorPage(pageable?: Pageable) {
		if (this.department.value) {
			// this.adminDepartmentStore.setActive(this.department.value.id);
			this.adminInstructorService.getPage(this.department.value.departmentName, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getInstructorPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getInstructorPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createInstructor() {
		this.adminInstructorService.createInstructor();
	}

	editInstructor(instructor: AdminInstructor) {
		this.adminInstructorService.editInstructor(instructor);
	}

	deleteInstructor(instructor: AdminInstructor) {
		this.adminInstructorService.deleteInstructor(instructor);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asInstructor(value: any): AdminInstructor {
		return value as AdminInstructor;
	}

	trackInstructor: TrackByFunction<AdminInstructor> = (index: number, instructor: AdminInstructor): string => {
		return instructor.id;
	};

}
