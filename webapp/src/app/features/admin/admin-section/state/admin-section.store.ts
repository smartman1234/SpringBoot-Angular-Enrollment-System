import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminSection } from "./admin-section.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminSectionState extends EntityState<AdminSection>, ActiveState {
	sectionPage: Page<AdminSection>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-section" })
export class AdminSectionStore extends EntityStore<AdminSectionState> {

	constructor() {
		super({ sectionPage: emptyPage });
	}

}
