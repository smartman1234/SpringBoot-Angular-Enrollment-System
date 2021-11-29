import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { TermState, TermStore } from "./term.store";
import { map } from "rxjs/operators";

@Injectable({ providedIn: "root" })
export class TermQuery extends QueryEntity<TermState> {

	terms$ = this.selectAll();
	termNames$ = this.terms$.pipe(
		map(terms => terms.map((term => term.termName))),
	);

	constructor(protected store: TermStore) {
		super(store);
	}

}
