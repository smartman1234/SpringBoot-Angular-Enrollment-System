import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminAuthorityState, AdminAuthorityStore } from "./admin-authority.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "role",
	sortByOrder: Order.ASC,
})
export class AdminAuthorityQuery extends QueryEntity<AdminAuthorityState> {

	adminAuthorities$ = this.selectAll();
	adminAuthorityPage$ = this.select(state => state.authorityPage);

	constructor(protected store: AdminAuthorityStore) {
		super(store);
	}

}
