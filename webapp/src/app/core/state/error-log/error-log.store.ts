import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface ErrorLogState {
	messages: string[],
}

export const initialErrorLogState = (): ErrorLogState => ({
	messages: [],
});

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "error-log" })
export class ErrorLogStore extends Store<ErrorLogState> {

	constructor() {
		super(initialErrorLogState());
	}

}
