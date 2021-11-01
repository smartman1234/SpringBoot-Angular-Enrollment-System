import { Pipe, PipeTransform } from "@angular/core";
import { select, Store } from "@ngrx/store";
import { AppState } from "../../shared/store/app-store.module";
import { Observable } from "rxjs";
import { selectIsLoading } from "../store/loading/loading.selectors";
import { debounceTime, map } from "rxjs/operators";

@Pipe({
	name: "isLoading",
})
export class LoadingPipe implements PipeTransform {

	constructor(
		private store: Store<AppState>,
	) {
	}

	transform(value: boolean): Observable<boolean> {
		return this.store.pipe(
			select(selectIsLoading),
			debounceTime(0),
			map(isLoading => value === isLoading),
		);
	}
}
