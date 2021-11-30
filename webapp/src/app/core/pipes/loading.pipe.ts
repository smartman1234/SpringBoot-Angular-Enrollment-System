import { Pipe, PipeTransform } from "@angular/core";
import { Observable } from "rxjs";
import { debounceTime, map } from "rxjs/operators";
import { LoadingQuery } from "../state/loading/loading.query";

@Pipe({
	name: "isLoading",
})
export class LoadingPipe implements PipeTransform {

	constructor(
		private loadingQuery: LoadingQuery,
	) {
	}

	transform(value: boolean): Observable<boolean> {
		return this.loadingQuery.isLoading$.pipe(
			debounceTime(0),
			map(isLoading => value === isLoading),
		);
	}
}
