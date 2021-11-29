import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminUserState, AdminUserStore } from "./admin-user.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "username",
	sortByOrder: Order.ASC,
})
export class AdminUserQuery extends QueryEntity<AdminUserState> {

	adminUserPage$ = this.select(state => state.userPage);

	constructor(protected store: AdminUserStore) {
		super(store);
	}

}
