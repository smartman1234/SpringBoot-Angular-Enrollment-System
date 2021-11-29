import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { Subject } from "./subject.model";

export interface SubjectState extends EntityState<Subject>, ActiveState {
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "subject" })
export class SubjectStore extends EntityStore<SubjectState> {

	constructor() {
		super();
	}

}
