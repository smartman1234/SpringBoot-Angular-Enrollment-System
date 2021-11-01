import { Injectable } from "@angular/core";
import { AbstractGenericCrudService } from "../../../core/services/generic-crud.service";
import { Course } from "../models/course.model";
import { HttpClient } from "@angular/common/http";
import { CourseInfoDialogComponent } from "../components/course-info-dialog/course-info-dialog.component";
import { MatDialog } from "@angular/material/dialog";

@Injectable({
	providedIn: "root",
})
export class CourseService extends AbstractGenericCrudService<Course, string> {

	constructor(
		protected http: HttpClient,
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

	openCourseInfo(courseId: string) {
		this.dialog.open(CourseInfoDialogComponent, {
			width: "100rem",
			data: { course$: this.readOne(courseId) },
		});
	}
}
