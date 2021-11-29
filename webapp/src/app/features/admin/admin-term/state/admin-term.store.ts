import { Injectable } from "@angular/core";
import { ActiveState, EntityState, EntityStore, StoreConfig } from "@datorama/akita";
import { AdminTerm } from "./admin-term.model";
import { Page } from "../../../../core/models/page.model";
import { emptyPage } from "../../../../core/constants/empty-page-slice";

export interface AdminTermState extends EntityState<AdminTerm>, ActiveState {
	termPage: Page<AdminTerm>,
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "admin-term" })
export class AdminTermStore extends EntityStore<AdminTermState> {

	constructor() {
		super({ termPage: emptyPage });
	}

}
