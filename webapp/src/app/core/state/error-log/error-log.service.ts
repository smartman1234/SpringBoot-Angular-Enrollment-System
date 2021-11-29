import { Injectable } from "@angular/core";
import { HttpErrorResponse, HttpStatusCode } from "@angular/common/http";
import { ErrorMessageDialogComponent } from "../../components/error-message-dialog/error-message-dialog.component";
import { MatDialog } from "@angular/material/dialog";
import { ErrorLogStore } from "./error-log.store";

@Injectable({
	providedIn: "root",
})
export class ErrorLogService {

	constructor(
		private dialog: MatDialog,
		// private store: Store<AppState>,
		private errorLogStore: ErrorLogStore,
	) {
	}

	openErrorMessages(errorResponse?: any) {
		if (errorResponse) {
			if (errorResponse instanceof HttpErrorResponse && errorResponse.status === HttpStatusCode.Unauthorized) {
				return;
			}
			// this.store.dispatch(updateErrorLogs({ errors: [errorResponse] }));
			this.errorLogStore.update({ messages: [this.errorToMessage(errorResponse)] });
		}
		this.dialog.open(ErrorMessageDialogComponent, {
			width: "70rem",
		});
	}

	errorToMessage(errorResponse: any): string {
		return errorResponse instanceof HttpErrorResponse && errorResponse.error != null
			? errorResponse.error.message : errorResponse.message ? errorResponse.message : errorResponse;
	}
}
