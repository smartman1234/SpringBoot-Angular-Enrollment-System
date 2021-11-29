import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { take } from "rxjs/operators";
import { Student } from "../state/student/student.model";
import { AuthenticationQuery } from "../../../../core/state/authentication/authentication.query";
import { StudentService } from "../state/student/student.service";
import { StudentQuery } from "../state/student/student.query";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {

	constructor(
		private studentService: StudentService,
		private studentQuery: StudentQuery,
		private authenticationQuery: AuthenticationQuery,
	) {
	}

	student$!: Observable<Student>;

	ngOnInit(): void {
		this.authenticationQuery.id$.pipe(take(1)).subscribe(userId => {
			this.studentService.getStudent(userId);
		});

		this.student$ = this.studentQuery.student$;
	}

}
