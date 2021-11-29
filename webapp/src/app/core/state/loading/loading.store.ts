import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface LoadingState {
	isLoading: boolean,
	totalRequest: number,
}

export const initialLoadingState = (): LoadingState => ({
	isLoading: false,
	totalRequest: 0,
});

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "loading" })
export class LoadingStore extends Store<LoadingState> {

	constructor() {
		super(initialLoadingState());
	}

}
