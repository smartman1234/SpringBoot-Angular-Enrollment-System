import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../shared/store/app-store.module";
import { Observable } from "rxjs";
import { Student } from "../../models/student.model";
import { selectStudentState } from "../../store/student/student.selectors";
import { take } from "rxjs/operators";
import { getStudent } from "../../store/student/student.actions";
import { selectUserId } from "../../../../core/store/authentication/authentication.selectors";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.component.html",
	styleUrls: ["./profile.component.scss"],
})
export class ProfileComponent implements OnInit {

	constructor(
		private store: Store<AppState>,
	) {
	}

	student$!: Observable<Student>;

	ngOnInit(): void {
		this.store.pipe(
			select(selectUserId),
			take(1),
		).subscribe(userId => {
			this.store.dispatch(getStudent({ id: userId }));
		});

		this.student$ = this.store.pipe(select(selectStudentState),);
	}

}
