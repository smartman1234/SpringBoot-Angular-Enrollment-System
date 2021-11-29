import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminUser } from "./admin-user.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminUserState extends EntityState<AdminUser>, ActiveState {
	userPage: Page<AdminUser>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-user" })
export class AdminUserStore extends EntityStore<AdminUserState> {

	constructor() {
		super({ userPage: emptyPage });
	}

}
