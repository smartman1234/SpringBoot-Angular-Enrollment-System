import { Injectable } from "@angular/core";
import { QueryEntity } from "@datorama/akita";
import { SubjectState, SubjectStore } from "./subject.store";

@Injectable({ providedIn: "root" })
export class SubjectQuery extends QueryEntity<SubjectState> {

	subjects$ = this.selectAll();

	constructor(protected store: SubjectStore) {
		super(store);
	}

}
