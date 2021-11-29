import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CourseStore } from "./course.store";
import { MatDialog } from "@angular/material/dialog";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { Course } from "./course.model";
import { CourseInfoDialogComponent } from "../../course-info-dialog/course-info-dialog.component";
import { take, tap } from "rxjs/operators";
import { CourseQuery } from "./course.query";
import { Observable, throwError } from "rxjs";
import { ErrorNotificationService } from "../../../../../core/services/error-notification.service";

@Injectable({ providedIn: "root" })
export class CourseService extends AbstractGenericCrudService<Course, string> {

	constructor(
		private courseStore: CourseStore,
		private courseQuery: CourseQuery,
		protected http: HttpClient,
		private errorNotificationService: ErrorNotificationService,
		private dialog: MatDialog,
	) {
		super(http, "/courses", {
			readAll: false,
			readPage: false,
			readSlice: false,
			create: false,
			update: false,
			updatePartial: false,
			delete: false,
		});
	}

	protected handleError(errorResponse: HttpErrorResponse): Observable<never> {
		this.errorNotificationService.open(errorResponse);
		return throwError(errorResponse);
	}

	openCourseInfo(courseId: string) {
		this.courseQuery.ids$.pipe(take(1)).subscribe(ids => {
			if (!ids || !ids.includes(courseId)) {
				this.readOne(courseId).pipe(
					tap(course => this.courseStore.add(course)),
				).subscribe();
			}
		});

		this.dialog.open(CourseInfoDialogComponent, {
			width: "100rem",
			data: { course$: this.courseQuery.course(courseId) },
		});
	}
}
