import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminBuildingState, AdminBuildingStore } from "./admin-building.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "buildingNumber",
	sortByOrder: Order.ASC,
})
export class AdminBuildingQuery extends QueryEntity<AdminBuildingState> {

	adminBuildings$ = this.selectAll();
	adminBuildingPage$ = this.select(state => state.buildingPage);

	constructor(protected store: AdminBuildingStore) {
		super(store);
	}

}
