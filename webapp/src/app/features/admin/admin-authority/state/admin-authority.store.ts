import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, MultiActiveState, StoreConfig } from "@datorama/akita";
import { AdminAuthority } from "./admin-authority.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminAuthorityState extends EntityState<AdminAuthority>, MultiActiveState {
	authorityPage: Page<AdminAuthority>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-authority" })
export class AdminAuthorityStore extends EntityStore<AdminAuthorityState> {

	constructor() {
		super({ authorityPage: emptyPage, active: [] });
	}

}
