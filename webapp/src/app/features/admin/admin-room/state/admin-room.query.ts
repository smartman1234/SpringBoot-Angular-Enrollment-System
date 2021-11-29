import { Injectable } from "@angular/core";
import { Order, QueryConfig, QueryEntity } from "@datorama/akita";
import { AdminRoomState, AdminRoomStore } from "./admin-room.store";

@Injectable({ providedIn: "root" })
@QueryConfig({
	sortBy: "roomNumber",
	sortByOrder: Order.ASC,
})
export class AdminRoomQuery extends QueryEntity<AdminRoomState> {

	adminRooms$ = this.selectAll();
	adminRoomPage$ = this.select(state => state.roomPage);

	constructor(protected store: AdminRoomStore) {
		super(store);
	}

}
