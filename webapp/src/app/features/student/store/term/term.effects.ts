import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { getAllTerms, getAllTermsSuccess } from "./term.actions";
import { exhaustMap, map, withLatestFrom } from "rxjs/operators";
import { TermService } from "../../services/term.service";
import { Term } from "../../models/term.model";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../shared/store/app-store.module";
import { selectTerms } from "./term.selectors";
import { EMPTY } from "rxjs";

@Injectable()
export class TermEffects {
	constructor(
		private actions$: Actions,
		private termService: TermService,
		private store: Store<AppState>,
	) {
	}

	getAllTerms$ = createEffect(() => this.actions$.pipe(
		ofType(getAllTerms),
		withLatestFrom(this.store.pipe(select(selectTerms))),
		exhaustMap(([, terms]) => {
			if (terms.length > 0) {
				return EMPTY;
			}

			return this.termService.readAll().pipe(
				map((terms: (Term)[]) => getAllTermsSuccess({ terms })),
			);
		}),
		),
	);
}
