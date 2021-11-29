import { HttpClient, HttpErrorResponse, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { tap } from "rxjs/operators";
import { AdminCourse } from "./admin-course.model";
import { AdminCourseStore } from "./admin-course.store";
import { AbstractGenericCrudService, Pageable } from "../../../../core/services/generic-crud.service";
import { QueryParamOperator } from "../../../../core/constants/query-param-operator.enum";
import { EMPTY, Observable } from "rxjs";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogService } from "../../../../core/state/error-log/error-log.service";
import { AdminCourseCreateComponent } from "../admin-course-create/admin-course-create.component";
import { AdminCourseEditComponent } from "../admin-course-edit/admin-course-edit.component";
import { ConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { cacheable } from "@datorama/akita";
import { NotificationService } from "../../../../core/services/notification.service";

@Injectable({ providedIn: "root" })
export class AdminCourseService extends AbstractGenericCrudService<AdminCourse, string> {

	constructor(
		protected http: HttpClient,
		private adminCourseStore: AdminCourseStore,
		private dialog: MatDialog,
		private errorLogService: ErrorLogService,
		private notificationService: NotificationService,
	) {
		super(http, "/admin/courses");
	}

	subjectAcronyms = new Set();
	subjectAcronym: string = "";
	pageable = {
		...this.defaultPageable,
		sort: ["courseCode"],
	};

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorLogService.openErrorMessages(errorResponse);
		return EMPTY;
	}

	getAll(subjectAcronym: string) {
		let httpParams = new HttpParams();

		if (subjectAcronym) {
			httpParams = httpParams
				.append(`subject.subjectAcronym[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, subjectAcronym);
		}

		const readAll$ = this.readAll(httpParams).pipe(tap(entities => {
			this.adminCourseStore.add(entities);
		}));

		if (this.subjectAcronyms.has(subjectAcronym)) {
			return EMPTY;
		} else {
			this.subjectAcronyms.add(subjectAcronym);
			return readAll$;
		}
	}

	getPage(subjectAcronym?: string, pageable?: Pageable) {
		this.subjectAcronym = subjectAcronym ? subjectAcronym : this.subjectAcronym;
		this.pageable = { ...this.pageable, ...pageable };

		let httpParams = new HttpParams({ fromObject: { ...this.pageable } })
			.append(`subject.subjectAcronym[${QueryParamOperator.EQUALS_IGNORE_CASE}]`, this.subjectAcronym);
		this.readPage(httpParams).pipe(
			tap(coursePage => this.adminCourseStore.update({ coursePage })),
		).subscribe();
	}

	createCourse() {
		const dialogRef = this.dialog.open(AdminCourseCreateComponent, { width: "70rem" });
		dialogRef.afterClosed().subscribe((formValue: AdminCourse) => {
			if (formValue) {
				this.create(formValue).subscribe(course => {
					this.notificationService.open("New Course Created!", 2000);
					this.adminCourseStore.add(course);
					this.getPage();
				});
			}
		});
	}

	editCourse(course: AdminCourse) {
		const dialogRef = this.dialog.open(AdminCourseEditComponent, {
			data: { course },
			width: "70rem",
		});
		dialogRef.afterClosed().subscribe((formValue: AdminCourse) => {
			if (formValue) {
				this.update(formValue, course.id).subscribe(course => {
					this.notificationService.open("Changes Saved!", 2000);
					this.adminCourseStore.update(course.id, course);
					this.getPage();
				});
			}
		});
	}

	deleteCourse(course: AdminCourse) {
		const dialogRef = this.dialog.open(ConfirmDialogComponent, {
				width: "50rem",
				data: { message: "Do you want to remove course " + course.courseCode + "?" },
			},
		);

		dialogRef.afterClosed().subscribe(confirm => {
			if (confirm === true) {
				this.delete(course.id).subscribe(() => {
					this.notificationService.open("Course Deleted!", 2000);
					this.adminCourseStore.remove(course.id);
					this.getPage();
				});
			}
		});
	}
}
