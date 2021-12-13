import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { catchError, tap } from "rxjs/operators";
import { EnrollmentId } from "./enrollment-id.model";
import { EnrollmentIdStore } from "./enrollment-id.store";
import { AbstractGenericCrudService } from "../../../../../core/services/generic-crud.service";
import { ErrorLogService } from "../../../../../core/state/error-log/error-log.service";
import { ErrorNotificationService } from "../../../../../core/services/error-notification.service";
import { EMPTY, Observable } from "rxjs";
import { QueryParamOperator } from "../../../../../core/constants/query-param-operator.enum";

@Injectable({ providedIn: "root" })
export class EnrollmentIdService extends AbstractGenericCrudService<EnrollmentId, string> {

	constructor(
		protected http: HttpClient,
		private enrollmentIdStore: EnrollmentIdStore,
		private errorLogService: ErrorLogService,
		private errorNotificationService: ErrorNotificationService,
	) {
		super(http, "/students/:id/sections", {
			readOne: false,
			readAll: false,
			readPage: false,
			readSlice: false,
			create: false,
			update: false,
			updatePartial: false,
			delete: false,
		});
	}

	readonly enrollmentIdsUrl = "/sectionIds";

	getEnrollmentIds(termName: string, studentId: string) {
		const url = this.getUrlWithId(this.entityUrl + this.enrollmentIdsUrl, studentId);
		const key = `section.term.termName`;
		this.http.get<Array<EnrollmentId>>(url, { ...this.httpOptions, params: { [key]: termName } }).pipe(
			tap(enrollmentIds => this.enrollmentIdStore.set(enrollmentIds)),
			catchError(errorResponse => {
				this.errorNotificationService.open(errorResponse);
				return EMPTY;
			}),
		).subscribe();
	}

}
