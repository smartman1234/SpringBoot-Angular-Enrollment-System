import { Component, OnInit } from "@angular/core";
import { Observable } from "rxjs";
import { ErrorLogQuery } from "../../state/error-log/error-log.query";

@Component({
	selector: "app-error-message-dialog",
	templateUrl: "./error-message-dialog.component.html",
	styleUrls: ["./error-message-dialog.component.scss"],
})
export class ErrorMessageDialogComponent implements OnInit {

	constructor(
		// public store: Store<AppState>,
		private errorLogQuery: ErrorLogQuery,
	) {
	}

	errorMessages$!: Observable<string[]>;

	ngOnInit(): void {
		// this.errorMessages$ = this.store.pipe(select(selectErrorMessages));
		this.errorMessages$ = this.errorLogQuery.errorMessages$;
	}

}
