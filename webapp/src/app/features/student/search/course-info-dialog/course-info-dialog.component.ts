import { Component, Inject, OnInit } from "@angular/core";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { Observable } from "rxjs";
import { Course } from "../state/course/course.model";

@Component({
	selector: "app-course-info-dialog",
	templateUrl: "./course-info-dialog.component.html",
	styleUrls: ["./course-info-dialog.component.scss"],
})
export class CourseInfoDialogComponent implements OnInit {

	constructor(
		@Inject(MAT_DIALOG_DATA) public data: { course$: Observable<Course | undefined> },
	) {
	}

	ngOnInit(): void {
	}

}
