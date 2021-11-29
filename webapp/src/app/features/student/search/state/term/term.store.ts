import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Term } from "./term.model";

export interface TermState extends EntityState<Term>, ActiveState {
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "term" })
export class TermStore extends EntityStore<TermState> {

	constructor() {
		super();
	}

}
