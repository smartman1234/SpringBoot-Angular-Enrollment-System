import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { LoadingState, LoadingStore } from "./loading.store";

@Injectable({ providedIn: "root" })
export class LoadingQuery extends Query<LoadingState> {

	isLoading$ = this.select(state => state.isLoading);
	totalRequest$ = this.select(state => state.totalRequest);

	constructor(protected store: LoadingStore) {
		super(store);
	}

}
