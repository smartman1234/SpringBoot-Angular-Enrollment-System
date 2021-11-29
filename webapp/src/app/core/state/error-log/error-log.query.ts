import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { ErrorLogState, ErrorLogStore } from "./error-log.store";

@Injectable({ providedIn: "root" })
export class ErrorLogQuery extends Query<ErrorLogState> {

	errorMessages$ = this.select(state => state.messages);

	constructor(protected store: ErrorLogStore) {
		super(store);
	}

}
