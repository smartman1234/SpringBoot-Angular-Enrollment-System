import { Component, OnInit } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../../../shared/store/app-store.module";
import { Observable } from "rxjs";
import { selectErrorMessages } from "../../../../core/store/error-log/error-log.selectors";

@Component({
	selector: "app-error-message-dialog",
	templateUrl: "./error-message-dialog.component.html",
	styleUrls: ["./error-message-dialog.component.scss"],
})
export class ErrorMessageDialogComponent implements OnInit {

	constructor(
		public store: Store<AppState>,
	) {
	}

	errorMessages$!: Observable<string[]>;

	ngOnInit(): void {
		this.errorMessages$ = this.store.pipe(select(selectErrorMessages));
	}

}
