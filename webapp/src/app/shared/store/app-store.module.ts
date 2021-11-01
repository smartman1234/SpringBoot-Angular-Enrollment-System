import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { ActionReducerMap, StoreModule } from "@ngrx/store";
import { environment } from "../../../environments/environment";
import { StoreDevtoolsModule } from "@ngrx/store-devtools";
import { metaReducers } from "./meta.reducer";

export interface AppState {
}

export const reducers: ActionReducerMap<AppState> = {};

@NgModule({
	declarations: [],
	imports: [
		StoreModule.forRoot(reducers, { metaReducers }),
		EffectsModule.forRoot([]),
		environment.production ? [] : StoreDevtoolsModule.instrument(),
	],
	providers: [],
})
export class AppStoreModule {
}
