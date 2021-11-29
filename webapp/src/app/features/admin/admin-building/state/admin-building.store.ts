import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminBuilding } from "./admin-building.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminBuildingState extends EntityState<AdminBuilding>, ActiveState {
	buildingPage: Page<AdminBuilding>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-building" })
export class AdminBuildingStore extends EntityStore<AdminBuildingState> {

	constructor() {
		super({ buildingPage: emptyPage });
	}

}
