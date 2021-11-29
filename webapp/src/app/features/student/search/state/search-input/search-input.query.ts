import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { SearchInputState, SearchInputStore } from "./search-input.store";

@Injectable({ providedIn: "root" })
export class SearchInputQuery extends Query<SearchInputState> {

	searchInput$ = this.select(state => state);
	termInput$ = this.select(state => state.term);

	constructor(protected store: SearchInputStore) {
		super(store);
	}

}
