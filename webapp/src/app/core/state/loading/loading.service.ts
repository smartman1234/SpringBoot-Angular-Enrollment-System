import { Injectable } from "@angular/core";
import { LoadingStore } from "./loading.store";

@Injectable({
	providedIn: "root",
})
export class LoadingService {

	constructor(
		private loadingStore: LoadingStore,
	) {
	}

	loadingOn() {
		this.loadingStore.update({
			isLoading: true
		});
	}

	loadingOff() {
		this.loadingStore.update(state => ({
			...state, isLoading: state.totalRequest > 0
		}));
	}

	increaseRequest() {
		this.loadingStore.update(state => ({
			...state, totalRequest: state.totalRequest + 1
		}));
	}

	decreaseRequest() {
		this.loadingStore.update(state => ({
			...state,
			totalRequest: state.totalRequest > 0 ? state.totalRequest - 1 : 0
		}));
	}
}
