import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../shared/store/app-store.module";
import { exhaustMap, map, withLatestFrom } from "rxjs/operators";
import { EMPTY } from "rxjs";
import { SubjectService } from "../../services/subject.service";
import { getAllSubjects, getAllSubjectsSuccess } from "./subject.actions";
import { selectSubjects } from "./subject.selectors";
import { Subject } from "../../models/subject.model";

@Injectable()
export class SubjectEffects {
	constructor(
		private actions$: Actions,
		private subjectService: SubjectService,
		private store: Store<AppState>,
	) {
	}

	getAllSubjects$ = createEffect(() => this.actions$.pipe(
		ofType(getAllSubjects),
		withLatestFrom(this.store.pipe(select(selectSubjects))),
		exhaustMap(([, subjects]) => {
			if (subjects.length > 0) {
				return EMPTY;
			}

			return this.subjectService.readAll().pipe(
				map((subjects: (Subject)[]) => getAllSubjectsSuccess({ subjects })),
			);
		}),
		),
	);
}
