import { NgModule } from "@angular/core";
import { ActionReducerMap, createFeatureSelector, StoreModule } from "@ngrx/store";
import { authenticationReducer, AuthenticationUserState } from "./authentication/authentication.reducer";
import { EffectsModule } from "@ngrx/effects";
import { AuthenticationEffects } from "./authentication/authentication.effects";
import { coreFeatureKey, coreReducers } from "./index";

@NgModule({
	declarations: [],
	imports: [
		StoreModule.forFeature(coreFeatureKey, coreReducers),
		EffectsModule.forFeature([AuthenticationEffects]),
	],
})
export class CoreStoreModule {
}
