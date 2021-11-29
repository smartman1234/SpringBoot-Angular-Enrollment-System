import { Component, OnInit } from "@angular/core";
import { EnrollmentStatus } from "../../../../core/constants/enrollment-status";
import { Enrollment } from "../state/enrollment/enrollment.model";

@Component({
	selector: "app-schedule",
	templateUrl: "./schedule.component.html",
	styleUrls: ["./schedule.component.scss"],
})
export class ScheduleComponent implements OnInit {

	title = "Schedule";
	subtitle = "Schedule for Enrollment";
	enrollmentStatuses = [EnrollmentStatus.ENROLLED, EnrollmentStatus.ON_WAIT_LIST];

	constructor() {
	}

	ngOnInit(): void {
	}

	asEnrollment(value: any): Enrollment {
		return value as Enrollment;
	}

}
