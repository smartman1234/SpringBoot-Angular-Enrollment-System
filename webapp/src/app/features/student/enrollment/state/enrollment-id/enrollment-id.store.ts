import { Injectable } from "@angular/core";
import { EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { EnrollmentId } from "./enrollment-id.model";

export interface EnrollmentIdState extends EntityState<EnrollmentId> {
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "enrollment-id", idKey: "sectionId" })
export class EnrollmentIdStore extends EntityStore<EnrollmentIdState> {

	constructor() {
		super();
	}

}
