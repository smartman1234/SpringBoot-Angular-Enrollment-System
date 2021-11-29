import { Component, OnInit, TrackByFunction } from "@angular/core";
import { FormBuilder, FormControl, Validators } from "@angular/forms";
import { AdminSubjectService } from "../state/admin-subject.service";
import { AdminSubjectQuery } from "../state/admin-subject.query";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { ScrollToTopService } from "../../../../core/services/scroll-to-top.service";
import { Observable } from "rxjs";
import { AdminSubject } from "../state/admin-subject.model";
import { Page } from "../../../../core/models/page.model";
import { Sort, SortDirection } from "@angular/material/sort";
import { filter, takeUntil } from "rxjs/operators";
import { Pageable } from "../../../../core/services/generic-crud.service";
import { PageEvent } from "@angular/material/paginator";
import { AdminDepartmentService } from "../../admin-department/state/admin-department.service";
import { AdminDepartmentQuery } from "../../admin-department/state/admin-department.query";
import { AdminDepartmentStore } from "../../admin-department/state/admin-department.store";
import { AdminDepartment } from "../../admin-department/state/admin-department.model";
import { UnsubscribeComponent } from "../../../../core/components/unsubscribe/unsubscribe.component";
import { combineQueries } from "@datorama/akita";

@Component({
	selector: "app-admin-subject-list",
	templateUrl: "./admin-subject-list.component.html",
	styleUrls: ["./admin-subject-list.component.scss"],
})
export class AdminSubjectListComponent extends UnsubscribeComponent implements OnInit {

	constructor(
		private formBuilder: FormBuilder,
		private adminSubjectService: AdminSubjectService,
		private adminSubjectQuery: AdminSubjectQuery,
		private adminDepartmentService: AdminDepartmentService,
		private adminDepartmentQuery: AdminDepartmentQuery,
		private adminDepartmentStore: AdminDepartmentStore,
		private errorLogService: ErrorLogService,
		private scrollToTopService: ScrollToTopService,
	) {
		super();
	}

	title: string = "Subject";
	subtitle: string = "Subject List";
	departments$!: Observable<AdminDepartment[]>;
	subjectPage$!: Observable<Page<AdminSubject>>;
	sortActive: string = "";
	sortDirection: SortDirection = "asc";

	displayedColumns: string[] = ["id", "subjectName", "subjectAcronym", "departmentId", "edit", "delete"];

	departmentForm = this.formBuilder.group({
		department: ["", { validators: [Validators.required] }],
	});

	get department() {
		return this.departmentForm.get("department") as FormControl;
	}

	ngOnInit(): void {
		const sort = this.adminSubjectService.pageable.sort[0].split(",");
		this.sortActive = sort[0];
		this.sortDirection = sort.length > 1 ? sort[1] as SortDirection : "asc";

		this.subjectPage$ = this.adminSubjectQuery.adminSubjectPage$;
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
				this.getSubjectPage();
			}
		});
	}

	getSubjectPage(pageable?: Pageable) {
		if (this.department.value) {
			this.adminDepartmentStore.setActive(this.department.value.id);
			this.adminSubjectService.getPage(this.department.value.departmentName, pageable);
		}
	}

	onSortChange(sort: Sort) {
		this.getSubjectPage({
			page: 0,
			sort: [sort.active.concat(",").concat(sort.direction)],
		});
	}

	onPageEvent(pageEvent: PageEvent) {
		this.getSubjectPage({
			page: pageEvent.pageIndex,
			size: pageEvent.pageSize,
		});
		this.scrollToTopService.toTop("content", 50);
	}

	createSubject() {
		this.adminSubjectService.createSubject();
	}

	editSubject(subject: AdminSubject) {
		this.adminSubjectService.editSubject(subject);
	}

	deleteSubject(subject: AdminSubject) {
		this.adminSubjectService.deleteSubject(subject);
	}

	openErrorMessages(errorResponse?: any) {
		this.errorLogService.openErrorMessages(errorResponse);
	}

	asSubject(value: any): AdminSubject {
		return value as AdminSubject;
	}

	trackSubject: TrackByFunction<AdminSubject> = (index: number, subject: AdminSubject): string => {
		return subject.id;
	};

}
