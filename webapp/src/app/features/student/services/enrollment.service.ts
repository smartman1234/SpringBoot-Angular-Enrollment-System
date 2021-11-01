import { Injectable } from "@angular/core";
import { AbstractGenericCrudService } from "../../../core/services/generic-crud.service";
import { Enrollment } from "../models/enrollment.model";
import { HttpClient, HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { EMPTY, Observable } from "rxjs";
import { catchError } from "rxjs/operators";
import { QueryParamOperator } from "../../../core/constants/query-param-operator.enum";
import { ErrorNotificationService } from "../../../core/services/error-notification.service";
import { EnrollmentId } from "../models/enrollment.id.model";
import { ErrorMessageDialogComponent } from "../components/error-message-dialog/error-message-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { Store } from "@ngrx/store";
import { AppState } from "../../../shared/store/app-store.module";
import { updateErrorLogs } from "../../../core/store/error-log/error-log.actions";

@Injectable({
	providedIn: "root",
})
export class EnrollmentService extends AbstractGenericCrudService<Enrollment, string> {

	constructor(
		protected http: HttpClient,
		private dialog: MatDialog,
		private store: Store<AppState>,
		private errorNotificationService: ErrorNotificationService,
	) {
		super(http, "/students/:id/sections", {
			updatePartialUrl: "/:id/enrollment-status",
			update: false,
		});
	}

	readonly enrollmentIdsUrl = "/sectionIds";

	getEnrollmentIds(termName: string, studentId: string): Observable<Array<EnrollmentId>> {
		const url = this.getUrlWithId(this.entityUrl + this.enrollmentIdsUrl, studentId);
		const key = `section.term.termName[${QueryParamOperator.EQUALS_IGNORE_CASE}]`;
		return this.http
			.get<Array<EnrollmentId>>(url, { ...this.httpOptions, params: { [key]: termName } })
			.pipe(catchError(errorResponse => {
				this.errorNotificationService.open(errorResponse);
				return EMPTY;
			}));
	}

	updatePartial(payload: Partial<Enrollment>, id1: string, id2?: string, id3?: string): Observable<Enrollment> {
		const url = this.getUrlWithId(this.entityUrl + this.options.updatePartialUrl, id1, id2, id3);
		return this.http
			.patch<Enrollment>(url, payload, this.httpOptions)
			.pipe(catchError(errorResponse => this.handleError(errorResponse)));
	}

	openErrorMessages(errorResponse?: any) {
		if (errorResponse) {
			if (errorResponse instanceof HttpErrorResponse && errorResponse.status === HttpStatusCode.Unauthorized) {
				return;
			}
			this.store.dispatch(updateErrorLogs({ errors: [errorResponse] }));
		}
		this.dialog.open(ErrorMessageDialogComponent, {
			width: "70rem",
		});
	}
}
