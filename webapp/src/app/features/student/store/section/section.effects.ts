import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { SectionService } from "../../services/section.service";
import { ErrorNotificationService } from "../../../../core/services/error-notification.service";
import {
	getSectionPage,
	getSectionPageSuccess,
	getSections,
	getSectionSlice,
	getSectionSliceSuccess,
	getSectionsSuccess,
} from "./section.actions";
import { catchError, map, switchMap } from "rxjs/operators";
import { EMPTY } from "rxjs";

@Injectable()
export class SectionEffects {

	constructor(
		private actions$: Actions,
		private sectionService: SectionService,
		private errorNotificationService: ErrorNotificationService,
	) {
	}

	getSections$ = createEffect(() => this.actions$.pipe(
		ofType(getSections),
		switchMap(action => {
			return this.sectionService.getAll(action.searchInput).pipe(
				map(sections => {
					return getSectionsSuccess({ sections });
				}),
				catchError(errorResponse => {
					this.errorNotificationService.open(errorResponse);
					return EMPTY;
				}),
			);
		}),
	));

	getSectionPage$ = createEffect(() => this.actions$.pipe(
		ofType(getSectionPage),
		switchMap(action => {
			return this.sectionService.getPage(action.searchInput).pipe(
				map(pageSection => {
					return getSectionPageSuccess({ pageSection });
				}),
				catchError(errorResponse => {
					this.errorNotificationService.open(errorResponse);
					return EMPTY;
				}),
			);
		}),
	));

	getSectionSlice$ = createEffect(() => this.actions$.pipe(
		ofType(getSectionSlice),
		switchMap(action => {
			return this.sectionService.getSlice(action.searchInput).pipe(
				map(sliceSection => {
					return getSectionSliceSuccess({ sliceSection });
				}),
				catchError(errorResponse => {
					this.errorNotificationService.open(errorResponse);
					return EMPTY;
				}),
			);
		}),
	));

}
