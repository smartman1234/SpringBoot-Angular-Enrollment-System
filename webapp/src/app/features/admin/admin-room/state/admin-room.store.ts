import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminRoom } from "./admin-room.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminRoomState extends EntityState<AdminRoom>, ActiveState {
	roomPage: Page<AdminRoom>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-room" })
export class AdminRoomStore extends EntityStore<AdminRoomState> {

	constructor() {
		super({ roomPage: emptyPage });
	}

}
