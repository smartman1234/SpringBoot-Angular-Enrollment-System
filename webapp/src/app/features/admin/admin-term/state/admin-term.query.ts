import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminTermState, AdminTermStore } from "./admin-term.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "dateStart",
	sortByOrder: Order.ASC,
})
export class AdminTermQuery extends QueryEntity<AdminTermState> {

	adminTerms$ = this.selectAll();
	adminTermPage$ = this.select(state => state.termPage);

	constructor(protected store: AdminTermStore) {
		super(store);
	}

}
