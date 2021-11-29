import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Course } from "../../models/course.model";
import { Observable } from "rxjs";

@Component({
	selector: "app-course-info-dialog",
	templateUrl: "./course-info-dialog.component.html",
	styleUrls: ["./course-info-dialog.component.scss"],
})
export class CourseInfoDialogComponent implements OnInit {

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { course$: Observable<Course> },
	) {
	}

	ngOnInit(): void {
	}

}
