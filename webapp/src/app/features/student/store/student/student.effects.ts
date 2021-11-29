import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../shared/store/app-store.module";
import { catchError, exhaustMap, map, withLatestFrom } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { StudentService } from "../../services/student.service";
import { getStudent, getStudentSuccess } from "./student.actions";
import { selectStudentState } from "./student.selectors";
import { Student } from "../../models/student.model";
import { ErrorNotificationService } from "../../../../core/services/error-notification.service";

@Injectable()
export class StudentEffects {
	constructor(
		private actions$: Actions,
		private studentService: StudentService,
		private errorNotificationService: ErrorNotificationService,
		private store: Store<AppState>,
	) {
	}

	getStudent$ = createEffect(() => this.actions$.pipe(
		ofType(getStudent),
		withLatestFrom(this.store.pipe(select(selectStudentState))),
		exhaustMap(([action, student]) => {
			if (student.id) {
				return EMPTY;
			}
			return this.studentService.readOne(action.id).pipe(
				map((student: Student) => getStudentSuccess({ student })),
				catchError(errorResponse => {
					this.errorNotificationService.open(errorResponse);
					return EMPTY;
				}),
			);
		}),
	));
}