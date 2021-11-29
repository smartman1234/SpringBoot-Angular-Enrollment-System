import { Injectable } from "@angular/core";
import { Query } from "@datorama/akita";
import { SectionState, SectionStore } from "./section.store";

@Injectable({ providedIn: "root" })
export class SectionQuery extends Query<SectionState> {

	sectionPage$ = this.select(state => state);
	courseSections$ = this.select(state => state.content);

	constructor(protected store: SectionStore) {
		super(store);
	}

}
